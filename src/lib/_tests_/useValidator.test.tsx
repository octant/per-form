import { useSchema } from '../useSchema';
import { useValidator } from '../useValidator';
import { schemaDefinition, IProgram } from './schema';
import { Form } from '../../.';

const invalidForm: Form<IProgram> = {
  name: 'a',
  code: '',
  description: 'a',
};

const validForm: Form<IProgram> = {
  name: 'New Program',
  code: 'np',
  description: '',
};

describe('validator', () => {
  const schema = useSchema(schemaDefinition);
  const validate = useValidator(schema);

  it('should list errors on invalid fields', () => {
    const messages = validate(invalidForm);

    expect(messages.name.length).toBe(2);
    expect(messages.code.length).toBe(1);
    expect(messages.description.length).toBe(1);
  });

  it('should not list errors on valid fields', () => {
    const messages = validate(validForm);

    expect(messages.name.length).toBe(0);
    expect(messages.code.length).toBe(0);
    expect(messages.description.length).toBe(0);
  });
});
