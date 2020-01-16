import * as React from 'react';

import Raw from './Raw';
import useForm, {
  FormWrapper,
  SchemaDefinition,
  IForm,
  IConverters,
} from '../../.';

interface Props<T> {
  converters?: IConverters;
  form: SchemaDefinition<T>;
  initialValues?: IForm;
  name: string;
  onChange?: (name: string, values: any) => void;
}

export interface IFormControls {
  isValid: boolean;
  reset(): void;
  submit(): void;
  values: any;
}

function Form<T>(
  { initialValues, form, name, onChange, converters = {} }: Props<T>,
  ref: React.Ref<any>
): React.ReactElement {
  const {
    change,
    dirty,
    errors,
    focus,
    isValid,
    reset: resetForm,
    schema,
    submit: submitForm,
    touched,
    values,
  } = useForm({
    converters,
    name,
    passedValues: initialValues,
    schema: form,
  });

  React.useEffect(() => {
    onChange && onChange(name, { raw: values, clean: submitForm(), isValid });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, name, values, isValid]);

  React.useImperativeHandle(ref, () => ({
    isValid,
    reset: () => resetForm(),
    submit: () => submitForm(),
    values,
  }));

  return (
    <div
      style={{
        padding: '1em',
        margin: '0.6em 0 ',
        borderRadius: '0.5em',
        border: isValid ? '1px solid green' : '1px solid #CCC',
      }}
    >
      <FormWrapper
        dirty={dirty}
        errors={errors}
        name={name}
        onChange={change}
        onFocus={focus}
        schema={schema}
        Template={Raw}
        touched={touched}
        values={values}
      />
    </div>
  );
}

export default React.forwardRef(Form);
