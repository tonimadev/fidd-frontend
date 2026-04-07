import { isValidCpf, isValidCnpj } from '../document-validators';

describe('Document Validators', () => {
  describe('isValidCpf', () => {
    it('should validate valid CPFs', () => {
      expect(isValidCpf('12345678909')).toBe(true);
      expect(isValidCpf('111.444.777-35')).toBe(true);
    });

    it('should reject invalid CPFs', () => {
      expect(isValidCpf('12345678900')).toBe(false);
      expect(isValidCpf('1234567890')).toBe(false);
      expect(isValidCpf('')).toBe(false);
      expect(isValidCpf(null as unknown as string)).toBe(false);
    });

    it('should reject repeated digit CPFs', () => {
      expect(isValidCpf('11111111111')).toBe(false);
      expect(isValidCpf('00000000000')).toBe(false);
    });
  });

  describe('isValidCnpj', () => {
    it('should validate valid CNPJs', () => {
      expect(isValidCnpj('11222333000181')).toBe(true);
      expect(isValidCnpj('12.345.678/0001-95')).toBe(true);
    });

    it('should reject invalid CNPJs', () => {
      expect(isValidCnpj('11222333000180')).toBe(false);
      expect(isValidCnpj('1122233300018')).toBe(false);
    });

    it('should reject repeated digit CNPJs', () => {
      expect(isValidCnpj('00000000000000')).toBe(false);
      expect(isValidCnpj('11111111111111')).toBe(false);
    });
  });
});
