import { SchemaDefinition, IForm } from '../.';

export interface IVehicle {
  make: string;
  model: string;
  year: number;
  color: string;
  hasLoan: boolean;
}

type VehicleSchemaDefinition = SchemaDefinition<IVehicle>;

export const schemaDefinition: VehicleSchemaDefinition = {
  make: {
    type: 'text',
    label: 'Make',
    required: true,
    validations: [
      {
        test: ({ make }: IVehicle) => {
          return /^[A-Z]/.test(make);
        },
        message: 'Must start with a capital letter',
      },
    ],
  },

  model: {
    type: 'text',
    label: 'Model',
    required: true,
  },

  year: {
    type: 'number',
    label: 'Year',
    required: true,
    defaultNull: 0,
    validations: [
      {
        test: ({ year }: IVehicle) => {
          return year > 2000;
        },
        message: 'Must be greater than 2000',
      },
    ],
  },

  color: {
    type: 'text',
    label: 'Color',
    defaultNull: null,
    converter: (
      key: string,
      values: IForm,
      defaultNull: any,
      dirty: boolean = false
    ): number | string => {
      const trimmedValue = values[key].trim();
      return trimmedValue === '' && defaultNull !== undefined && !dirty
        ? defaultNull
        : trimmedValue;
    },
  },

  hasLoan: {
    type: 'checkbox',
    label: 'Do you have a loan for this vehicle?',
    defaultValue: false,
    defaultNull: false,
  },
};

export default {
  new: schemaDefinition,
};
