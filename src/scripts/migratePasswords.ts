import { collection, getDocs, doc, updateDoc, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';

interface MigrationResult {
  total: number;
  success: number;
  failed: {
    userId: string;
    error: string;
  }[];
}

export async function migratePasswords(): Promise<MigrationResult> {
  const result: MigrationResult = {
    total: 0,
    success: 0,
    failed: []
  };

  const SALT_ROUNDS = 10;
  const BATCH_SIZE = 500; // Firebase limite à 500 opérations par batch

  try {
    // 1. Récupérer tous les utilisateurs
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    result.total = snapshot.size;

    // 2. Traiter les utilisateurs par lots
    let batch = writeBatch(db);
    let operationCount = 0;
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      
      // Vérifier si le mot de passe n'est pas déjà hashé
      // Les mots de passe hashés avec bcrypt commencent toujours par '$2a$' ou '$2b$'
      if (userData.password && 
          !userData.password.startsWith('$2a$') && 
          !userData.password.startsWith('$2b$')) {
        try {
          // Hasher le mot de passe
          const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
          
          // Ajouter l'opération au batch
          batch.update(doc(db, 'users', userDoc.id), {
            password: hashedPassword,
            updatedAt: Timestamp.now(),
            passwordMigratedAt: Timestamp.now()
          });
          
          operationCount++;
          result.success++;

          // Si on atteint la limite du batch, l'exécuter et en créer un nouveau
          if (operationCount === BATCH_SIZE) {
            await batch.commit();
            batch = writeBatch(db);
            operationCount = 0;
            console.log(`Processed ${result.success} users...`);
          }
        } catch (error) {
          result.failed.push({
            userId: userDoc.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    }

    // Exécuter le dernier batch s'il reste des opérations
    if (operationCount > 0) {
      await batch.commit();
    }

    // Générer le rapport de migration
    const report = {
      timestamp: new Date().toISOString(),
      ...result,
      success_rate: `${((result.success / result.total) * 100).toFixed(2)}%`
    };

    // Sauvegarder le rapport de migration
    await updateDoc(doc(db, 'system', 'migrationReports'), {
      [`password_migration_${Date.now()}`]: report
    });

    return result;

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Script d'exécution
if (require.main === module) {
  migratePasswords()
    .then((result) => {
      console.log('Migration completed');
      console.log(`Total users: ${result.total}`);
      console.log(`Successfully migrated: ${result.success}`);
      console.log(`Failed migrations: ${result.failed.length}`);
      if (result.failed.length > 0) {
        console.log('Failed migrations details:', 
          result.failed.map(f => `\nUser ${f.userId}: ${f.error}`).join(''));
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
