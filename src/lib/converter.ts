import { Field, IConverters, IForm, ISchema, IIs } from '../';

interface Props {
  key: string;
  values: IForm;
  schema: ISchema;
  converters?: IConverters;
  dirtyFields?: IIs;
}
export function convert({
  key,
  values,
  schema,
  converters = {},
  dirtyFields = {},
}: Props): any {
  const definition: Required<Field> = schema[key];
  const { converter, type, defaultNull } = definition;
  const converterWithType =
    converter !== undefined ? { [type]: converter } : {};

  const mergedConverters: IConverters = {
    ..._converters,
    ...converters,
    ...converterWithType,
  };

  return mergedConverters[type]
    ? mergedConverters[type](
        key,
        values,
        defaultNull,
        dirtyFields[key] || false
      )
    : values[key];
}

const _converters: IConverters = {
  date: (key: string, values: IForm, defaultNull: any): Date | string => {
    const date = new Date(values[key]);
    return values[key] === ''
      ? defaultNull
      : isValidDate(date)
      ? date
      : values[key];
  },

  number: (key: string, values: IForm, defaultNull: any): number | string => {
    return values[key] === ''
      ? defaultNull
      : /^[0-9.]+$/.test(values[key])
      ? /\./.test(values[key])
        ? parseFloat(values[key])
        : parseInt(values[key])
      : values[key];
  },

  text: (key: string, values: IForm, defaultNull: any): number | string => {
    const trimmedValue = values[key].trim();
    return trimmedValue === '' && defaultNull !== undefined
      ? defaultNull
      : trimmedValue;
  },
};

export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}
