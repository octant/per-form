import { useSchema } from '../useSchema';
import { schemaDefinition } from './schema';

it('should add missing properties to each field with default values', () => {
  const schema = useSchema(schemaDefinition);

  expect(schema.description.required).toBe(false);
  expect(schema.code.validations.length).toBe(0);
  expect(schema.name.display).toBe(true);
});
