import { SchemaDefinition } from '../../.';

export interface IProgram {
  name: string;
  code: string;
  description: string;
  rating: string;
}

type ProgramSchemaDefinition = SchemaDefinition<IProgram>;

export const schemaDefinition: ProgramSchemaDefinition = {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
    validations: [
      {
        test: ({ name }: IProgram) => /^[A-Z0-9]/.test(name),
        message: 'Must start with an uppercase',
      },
      {
        test: ({ name }: IProgram) => /.{3}/.test(name),
        message: 'Must be at least 3 characters',
      },
    ],
  },

  code: {
    type: 'text',
    label: 'Code',
    required: true,
  },

  description: {
    type: 'text',
    label: 'Description',
    validations: [
      {
        test: ({ description }: IProgram) => /^$|^[A-Z0-9]/.test(description),
        message: 'Must start with an uppercase',
      },
    ],
  },

  rating: {
    type: 'select',
    label: 'Rating',
    defaultNull: 1,
    options: [
      { value: 1.0, text: '1 star' },
      { value: 2.0, text: '2 stars' },
    ],
  },
};
