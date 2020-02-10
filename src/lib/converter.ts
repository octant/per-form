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

  return mergedConverters[type] !== undefined
    ? mergedConverters[type](
        key,
        values,
        defaultNull,
        dirtyFields[key] || false
      )
    : values[key] === '' && defaultNull !== undefined
    ? defaultNull
    : values[key];
}

const _converters: IConverters = {
  date: (key: string, values: IForm, defaultNull: any): Date | string => {
    const date = new Date(values[key]);

    if (values[key] === '') {
      if (defaultNull !== undefined) {
        return defaultNull;
      } else {
        return values[key];
      }
    } else {
      if (isValidDate(date)) {
        return date;
      } else {
        return values[key];
      }
    }
  },

  number: (key: string, values: IForm, defaultNull: any): number | string => {
    if (values[key] === '' && defaultNull !== undefined) {
      return defaultNull;
    } else {
      if (/^[0-9.]+$/.test(values[key])) {
        return parseFloat(values[key]);
      } else if (/^[0-9]+$/.test(values[key])) {
        return parseInt(values[key]);
      } else {
        return values[key];
      }
    }
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
