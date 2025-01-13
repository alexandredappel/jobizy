export const simulateDelay = (min: number = 300, max: number = 800): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const simulateNetworkError = (probability: number = 0.1): void => {
  if (Math.random() < probability) {
    throw new Error('Network Error');
  }
};