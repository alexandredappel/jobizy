// Utilitaires pour simuler le comportement réseau
export const simulateDelay = async () => {
  const delay = Math.floor(Math.random() * (800 - 300 + 1) + 300);
  await new Promise(resolve => setTimeout(resolve, delay));
};

export const simulateNetworkError = (probability: number = 0.1): boolean => {
  return Math.random() < probability;
};

export class MockNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MockNetworkError';
  }
}