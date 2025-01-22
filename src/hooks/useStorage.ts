import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';

export function useStorage() {
  const storage = getStorage();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (path: string, file: File) => {
    const storageRef = ref(storage, path);
    const result = await uploadBytes(storageRef, file);
    return result;
  };

  const getUrl = async (path: string) => {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  };

  return { uploadFile, getUrl, progress, error };
}