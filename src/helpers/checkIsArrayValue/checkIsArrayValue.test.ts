import { checkIsArrayValue } from './checkIsArrayValue';

describe('checkIsArrayValue', () => {
  it('returns true when value exists in array', () => {
    const array = ['apple', 'banana', 'orange'];
    const result = checkIsArrayValue(array, 'banana');
    expect(result).toBe(true);
  });

  it('returns false when value does not exist in array', () => {
    const array = ['apple', 'banana', 'orange'];
    const result = checkIsArrayValue(array, 'grape');
    expect(result).toBe(false);
  });

  it('works with numbers', () => {
    const array = [1, 2, 3, 4, 5];
    expect(checkIsArrayValue(array, 3)).toBe(true);
    expect(checkIsArrayValue(array, 6)).toBe(false);
  });

  it('works with empty array', () => {
    const array: string[] = [];
    const result = checkIsArrayValue(array, 'anything');
    expect(result).toBe(false);
  });

  it('handles mixed types', () => {
    const array = [1, 'two', 3, 'four'];
    expect(checkIsArrayValue(array, 1)).toBe(true);
    expect(checkIsArrayValue(array, 'two')).toBe(true);
    expect(checkIsArrayValue(array, 2)).toBe(false);
  });

  it('works with boolean values', () => {
    const array = [true, false];
    expect(checkIsArrayValue(array, true)).toBe(true);
    expect(checkIsArrayValue(array, false)).toBe(true);
    expect(checkIsArrayValue(array, 'true')).toBe(false);
  });

  it('works with null and undefined', () => {
    const array = [null, undefined, 'test'];
    expect(checkIsArrayValue(array, null)).toBe(true);
    expect(checkIsArrayValue(array, undefined)).toBe(true);
    expect(checkIsArrayValue(array, 'null')).toBe(false);
  });

  it(' work with objects', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const array = [obj1, obj2];
    
    expect(checkIsArrayValue(array, obj1)).toBe(true);
    expect(checkIsArrayValue(array, { id: 1 })).toBe(false); // Different object reference
  });
});