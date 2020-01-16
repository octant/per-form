import { useState, Dispatch, SetStateAction, useCallback } from 'react';
import {
  SchemaDefinition,
  IForm,
  Form,
  Schema,
  ValidationErrors,
  IIs,
  IConverters,
} from '../';
import { useSchema } from './useSchema';
import { useValidator } from './useValidator';
import { convert } from './';

interface Props<T> {
  converters?: IConverters;
  name: string;
  passedValues?: IForm;
  schema: SchemaDefinition<T>;
}

export default function useForm<T extends IForm>({
  converters = {},
  passedValues = {},
  schema,
}: Props<T>): {
  change: (k: string, v: any) => void;
  dirty: IIs;
  errors: ValidationErrors<T>;
  focus: (k: string) => void;
  isValid: boolean;
  reset: () => void;
  schema: Schema<SchemaDefinition<T>>;
  submit: (values?: Form<T>) => IForm;
  touched: IIs;
  values: Form<T>;
} {
  const fullSchema = useSchema(schema);
  const validate = useValidator(fullSchema);
  const [values, setValues] = useState(defaultValues());
  const [dirty, setDirty]: [IIs, Dispatch<SetStateAction<IIs>>] = useState(
    initWith(schema, false)
  );
  const [touched, setTouched] = useState(initWith(schema, false));

  function initWith(form: IForm, value: any) {
    return Object.keys(form).reduce((prev, curr) => {
      return { ...prev, [curr]: value };
    }, {});
  }

  function defaultValues(): Form<T> {
    return Object.entries(fullSchema).reduce((prev, [k, v]: [string, any]) => {
      const defaultValue = passedValues[k] || v.defaultValue || '';
      const cleanValue = defaultValue === v.defaultNull ? '' : defaultValue;
      return { ...prev, [k]: cleanValue };
    }, {} as Form<T>);
  }

  function isValid() {
    return Object.values(validate(values)).reduce((valid, errors) => {
      return valid && errors.length === 0;
    }, true);
  }

  function onChange(name: string, value: any) {
    const fieldName = name.split('.').slice(-1)[0];
    setValues({ ...values, [fieldName]: value });
    setDirty({ ...dirty, [fieldName]: true });
  }

  function onFocus(name: string) {
    const fieldName = name.split('.').slice(-1)[0];
    setTouched({ ...touched, [fieldName]: true });
  }

  function onReset() {
    setDirty(initWith(schema, false));
    setTouched(initWith(schema, false));
    setValues(defaultValues());
  }

  const onSubmit = useCallback(() => {
    return Object.entries(fullSchema).reduce((prev, [key]) => {
      return {
        ...prev,
        [key]: convert({
          key,
          values,
          schema: fullSchema,
          converters,
          dirtyFields: dirty,
        }),
      };
    }, values);
  }, [converters, dirty, fullSchema, values]);

  return {
    change: onChange,
    errors: validate(values),
    dirty,
    isValid: isValid(),
    focus: onFocus,
    reset: onReset,
    schema: fullSchema,
    submit: onSubmit,
    touched,
    values,
  };
}
