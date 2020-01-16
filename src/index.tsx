import * as React from 'react';

interface StringTMap<T> {
  [key: string]: T;
}

export interface IForm extends StringTMap<any> {}
export interface ISchema extends StringTMap<Required<Field>> {}
export interface IValidationErrors extends StringTMap<string[]> {}
export interface IIs extends StringTMap<boolean> {}
export interface IConverters
  extends StringTMap<
    (key: string, values: IForm, defaultNull: any, dirty?: boolean) => any
  > {}

export interface Validation {
  test(form: Form<IForm>): boolean;
  message: string;
}

export interface IField {
  dirty?: boolean;
  errors: string[];
  hint?: string;
  label: string;
  name: string;
  onChange: (name: string, value: any) => void;
  onFocus?: (name: string) => void;
  options?: { text: string; value: string }[];
  parent?: string;
  placeholder?: string;
  touched?: boolean;
  type: string;
  value: any;
}

export interface Field {
  [key: string]: any;
  type: string;
  label: string;
  required?: boolean;
  validations?: Array<Validation>;
  display?: boolean;
  defaultValue?: any;
  defaultNull?: any;
}

export interface ISubform<T> {
  name: {
    plural: string;
    singular: string;
  };
  type: 'list' | 'single';
  max?: number;
  min?: number;
  start?: number;
  schema: SchemaDefinition<T>;
}

export type MasterFormState = {
  [key: string]: React.RefObject<any>;
};

export type MasterForm<T, F> = {
  forms: {
    [key in keyof T]: ISubform<F>;
  };
} & {
  name: string;
};

export type Form<IForm> = {
  [key in keyof IForm]: any;
};

export type ValidationErrors<T> = {
  [key in keyof T]: string[];
};

export type SchemaDefinition<T> = {
  [key in keyof T]: Field;
};

export type Schema<T> = {
  [key in keyof T]: Required<Field>;
};

export { default as withConditionalRender } from './lib/withConditionalRender';
export { default as FormWrapper } from './components/FormWrapper';
export { default } from './lib/useForm';
