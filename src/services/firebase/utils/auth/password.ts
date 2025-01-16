export const PASSWORD_MIN_LENGTH = 8;

export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
};

export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/\d/.test(password)) strength += 25;
  return strength;
};