export const PASSWORD_MIN_LENGTH = 8;

export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
  return strength;
};