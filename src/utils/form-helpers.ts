/**
 * Form validation and formatting utilities
 */

/**
 * Formats a CPF string with mask (e.g., 123.456.789-00)
 * @param value The CPF string to format
 */
export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Formats a CNPJ string with mask (e.g., 12.345.678/0001-99)
 * @param value The CNPJ string to format
 */
export function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * Formats a phone number with mask (e.g., (11) 91234-5678)
 * @param value The phone number to format
 */
export function maskPhone(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

/**
 * Converts an email to lowercase
 * @param value The email to format
 */
export function maskEmail(value: string): string {
  return value.toLowerCase();
}

/**
 * Validates an email format
 * @param email The email to validate
 */
export function validateEmail(email: string): boolean {
  return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
}

/**
 * Validates a CPF number according to Brazilian rules
 * @param cpf The CPF number to validate (with or without mask)
 */
export function validateCPF(cpf: string): boolean {
  // Remove non-digits
  cpf = cpf.replace(/[^\d]+/g, '');

  // CPF should have 11 digits
  if (cpf.length !== 11) return false;

  // Check if all digits are the same
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Validates a CNPJ number according to Brazilian rules
 * @param cnpj The CNPJ number to validate (with or without mask)
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove non-digits
  cnpj = cnpj.replace(/[^\d]+/g, '');

  // CNPJ should have 14 digits
  if (cnpj.length !== 14) return false;

  // Check if all digits are the same
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  // Validate first check digit
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  // Validate second check digit
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}
