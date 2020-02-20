import * as React from 'react';
import { withConditionalRender, IField } from '../../.';

const errorStyle = {
  minHeight: '1.32em',
  fontSize: '0.8em',
  marginBottom: '0.5em',
};

const Feedback = withConditionalRender(
  ({ errors, dirty }: { errors: string[]; dirty?: boolean }) => (
    <span style={{ color: dirty ? 'red' : 'green' }}>
      {errors && errors[0]}
    </span>
  )
);

const ValidField = withConditionalRender(() => (
  <span style={{ color: 'green' }}>✓</span>
));

export default function Raw(props: IField): React.ReactElement {
  const {
    dirty,
    errors,
    label,
    name,
    onChange,
    onFocus,
    parent,
    touched,
    type,
    value,
    ...rest
  } = props;
  const options = props.options ? props.options : [];
  const isValid: boolean = errors ? errors.length === 0 : true;
  const isDirty: boolean = dirty ? dirty : false;
  const isTouched: boolean = touched ? touched : false;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    onChange(name.split('.').slice(-1)[0], value);
  }

  function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    onChange(name, checked);
  }

  function handleFocus(e: React.SyntheticEvent) {
    const { name } = e.target as HTMLInputElement | HTMLSelectElement;
    onFocus && onFocus(name);
  }

  function choose() {
    switch (type) {
      case 'checkbox':
        return (
          <div>
            <label htmlFor={name}>
              <input
                checked={value}
                name={`${parent}.${name}`}
                onChange={handleCheck}
                onFocus={handleFocus}
                type={type}
                {...rest}
              />{' '}
              {label}{' '}
              <ValidField and={[isValid, value !== '']} or={[isDirty]} />
            </label>
            <div style={errorStyle}>
              <Feedback
                and={[!isValid, isTouched]}
                errors={errors}
                dirty={isDirty}
              />
            </div>
          </div>
        );
      case 'radio':
        return (
          <div>
            <legend>
              {label}{' '}
              <ValidField and={[isValid, value !== '']} or={[isDirty]} />
            </legend>
            {options.map(
              (
                { text, value: optValue }: { text: string; value: any },
                i: number
              ) => {
                return (
                  <label key={`${name}-${i}`} htmlFor={name}>
                    {' '}
                    <input
                      checked={optValue === value}
                      name={`${parent}.${name}`}
                      onChange={handleChange}
                      type={type}
                      value={optValue}
                      {...rest}
                    />{' '}
                    {text}
                  </label>
                );
              }
            )}
            <div style={errorStyle}>
              <Feedback
                and={[!isValid, isTouched]}
                errors={errors}
                dirty={isDirty}
              />
            </div>
          </div>
        );
      case 'select':
        return (
          <div>
            <label>{label}</label>:{' '}
            <select
              name={`${parent}.${name}`}
              onChange={handleChange}
              onFocus={handleFocus}
              value={value}
              {...rest}
            >
              {options.map(
                (
                  { text, value: optValue }: { text: string; value: any },
                  i: number
                ) => (
                  <option key={`${name}-${i}`} value={optValue}>
                    {text}
                  </option>
                )
              )}
            </select>{' '}
            <ValidField and={[isValid, value !== '']} or={[isDirty]} />
            <div style={errorStyle}>
              <Feedback
                and={[!isValid, isTouched]}
                errors={errors}
                dirty={isDirty}
              />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <label>{label}</label>:{' '}
            <input
              name={`${parent}.${name}`}
              onChange={handleChange}
              onFocus={handleFocus}
              type={type}
              value={value}
              {...rest}
            />{' '}
            <ValidField and={[isValid, value !== '']} or={[isDirty]} />
            <div style={errorStyle}>
              <Feedback
                and={[!isValid]}
                or={[isTouched, value !== '']}
                errors={errors}
                dirty={isDirty}
              />
            </div>
          </div>
        );
    }
  }
  return choose();
}
