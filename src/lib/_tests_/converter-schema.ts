import { SchemaDefinition } from '../..';

export interface IProgram {
  firstName: string;
  lastName: string;
  dob: string;
  numberOfSiblings: number;
  hasDriversLicense: string;
  upgrade: string;
  agree: string;
}

type ProgramSchemaDefinition = SchemaDefinition<IProgram>;

export const schemaDefinition: ProgramSchemaDefinition = {
  firstName: {
    type: 'text',
    label: 'First Name',
    required: true,
    validations: [
      {
        test: ({ firstName }: IProgram) => /^[A-Z0-9]/.test(firstName),
        message: 'Must start with an uppercase',
      },
      {
        test: ({ firstName }: IProgram) => /.{3}/.test(firstName),
        message: 'Must be at least 3 characters',
      },
    ],
  },

  lastName: {
    type: 'text',
    label: 'Last Name',
    required: true,
    validations: [
      {
        test: ({ lastName }: IProgram) => /^[A-Z0-9]/.test(lastName),
        message: 'Must start with an uppercase',
      },
      {
        test: ({ lastName }: IProgram) => /.{3}/.test(lastName),
        message: 'Must be at least 3 characters',
      },
    ],
  },

  dob: {
    type: 'date',
    label: 'Date of Birth',
    required: true,
    defaultNull: new Date('3005-01-01'),
  },

  numberOfSiblings: {
    type: 'number',
    label: '# of Siblings',
    defaultNull: 0,
    validations: [
      {
        test: ({ numberOfSiblings }: IProgram) => numberOfSiblings > -1,
        message: 'Can not be less than 0',
      },
      {
        test: ({ numberOfSiblings }: IProgram) => numberOfSiblings < 20,
        message: 'Can not greater than 20',
      },
    ],
  },

  hasDriversLicense: {
    type: 'select',
    label: "Do you have a driver's license?",
    required: true,
    options: [
      {},
      { value: 'true', text: 'Yes' },
      { value: 'false', text: 'No' },
    ],
  },

  upgrade: {
    type: 'radio',
    label: 'Upgrade?',
    required: true,
    options: [
      { value: 'accept', text: 'Yes, upgrade my account' },
      { value: 'decline', text: "No, I'll keep what I have" },
    ],
  },

  agree: {
    type: 'checkbox',
    required: true,
    label: 'I agree to the terms and conditions',
    custom: ({ agree }: IProgram) => agree === 'true',
    message: 'You must agree to the terms and conditions',
  },
};

export default {
  new: schemaDefinition,
};
