import { Schema, Field } from '../';

export function useSchema<T>(schema: T): Schema<T> {
  const defaults = {
    defaultValue: '',
    display: true,
    required: false,
    validations: [],
  };

  const requiredSchema = Object.entries(schema).reduce((prev, [key, value]) => {
    const field: Required<Field> = value as Required<Field>;
    return {
      ...prev,
      [key]: Object.entries(defaults).reduce((prev, [k, v]) => {
        return field[k] === undefined ? { ...prev, [k]: v } : prev;
      }, field),
    };
  }, {}) as Schema<T>;

  return requiredSchema;
}
