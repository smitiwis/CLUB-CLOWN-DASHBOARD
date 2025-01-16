export const REGEX = {
  ALFANUMERIC: /^[A-Za-z0-9]+$/i,
  ALPHABETIC: /^[A-Z a-z]+$/i,
  NUMERIC: /^[0-9]+$/i,
  EMAIL: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
  PHONE: /^\d{1,9}$/i,
  NO_SPACES: /^[^\s]+$/i,
  NO_CHARACTERS_SPECIAL: /^[a-zA-ZÀ-ÿ0-9\s]+$/,
  UPPER_LETTER: /[A-Z]/,
  LOWERCASE_LETTER: /[a-z]/,
  NUMBER: /[0-9]/,
  PHONE_REGEX: /^[0-9]{9}$/,
  DNI: /^[0-9]{8}$/,
  RUC: /^[0-9]{11}$/,
  CE: /^[0-9]{8}$/,
  PASS: /^[0-9]{11}$/,
  
  PASSWORD_MIN_LENGTH: 6,
};
