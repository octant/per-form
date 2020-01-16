import { Form, ISchema, Schema, Validation, ValidationErrors } from '../';

export function useValidator<T extends ISchema>(passedSchema: Schema<T>) {
  function validate<F>(values: Form<F>): ValidationErrors<F> {
    const intersection = Object.keys(values).filter(key => !!passedSchema[key]);

    return intersection.reduce((prev, k) => {
      const { required, validations } = passedSchema[k];

      const validationsWithDefaults: Validation[] = required
        ? [
            {
              test: ({ [k]: field }: any) => !/^\s+/.test(field),
              message: 'This field can not start with blank spaces',
            },
            {
              test: ({ [k]: field }: any) => !!field,
              message: 'This field is required',
            },
            ...validations,
          ]
        : [
            {
              test: ({ [k]: field }: any) => !/^\s+/.test(field),
              message: 'This field can not start with blank spaces',
            },
            ...validations,
          ];

      return {
        ...prev,
        [k]: validationsWithDefaults.reduce<string[]>(
          (p, { test, message }): string[] =>
            test(values) ? p : [...p, message],
          []
        ),
      } as ValidationErrors<F>;
    }, {} as Form<F>);
  }

  return validate;
}
