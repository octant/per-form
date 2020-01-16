import { convert, isValidDate } from '../converter';
import { useSchema } from '../';
import { schemaDefinition } from './converter-schema';
import { IForm, IConverters } from '../../.';

// const schema = useSchema(schemaDefinition);

describe('convert number', () => {
  const schema = useSchema(schemaDefinition);

  const emptyString = '';
  const floatString = '1.3';
  const integerString = '13';
  const invalidString = '1a3';
  const key = 'numberOfSiblings';

  it('should convert an empty string to default null value', () => {
    const defaultNull = convert({
      key,
      values: { [key]: emptyString },
      schema,
    });

    expect(defaultNull).toEqual(0);
  });

  it('should convert an integer string to an integer', () => {
    const int = convert({ key, values: { [key]: integerString }, schema });

    expect(int).toEqual(13);
  });

  it('should convert a float string to a float', () => {
    const float = convert({ key, values: { [key]: floatString }, schema });

    expect(float).toEqual(1.3);
  });

  it('should return original value if invalid', () => {
    const invalid = convert({ key, values: { [key]: invalidString }, schema });

    expect(invalid).toEqual(invalidString);
  });
});

describe('convert date', () => {
  const schema = useSchema(schemaDefinition);

  const emptyString = '';
  const dateString = '1977-06-04';
  const invalidString = '14/04/2019';
  const key = 'dob';

  it('should convert an empty string to default null value', () => {
    const defaultNull = convert({
      key,
      values: { [key]: emptyString },
      schema,
    });
    expect(defaultNull).toEqual(new Date('3005-01-01'));
  });

  it('should convert a date string to a date', () => {
    const date = convert({ key, values: { [key]: dateString }, schema });
    expect(date).toEqual(new Date(dateString));
  });

  it('should return original value if invalid', () => {
    const invalid = convert({ key, values: { [key]: invalidString }, schema });
    expect(invalid).toEqual(invalidString);
  });
});

describe('custom converters', () => {
  const schema = useSchema(schemaDefinition);

  const converters = {
    checkbox: (key: 'agree', values: IForm) => values[key].toString(),
  } as IConverters;

  it('should use the custom converter for checkbox', () => {
    expect(
      convert({ key: 'agree', values: { agree: false }, schema, converters })
    ).toBe('false');
    expect(
      convert({ key: 'agree', values: { agree: false }, schema, converters })
    ).not.toBe(false);
  });
});

describe('text converters', () => {
  const schema = useSchema(schemaDefinition);

  const key = 'firstName';
  const leadingSpaceString = ' Michael';
  const trailingSpaceString = 'David ';

  it('should trim leading and trailing spaces', () => {
    const withoutLeading = convert({
      key,
      values: { [key]: leadingSpaceString },
      schema,
    });

    const withoutTrailing = convert({
      key,
      values: { [key]: trailingSpaceString },
      schema,
    });

    expect(withoutLeading).toEqual(leadingSpaceString.trim());
    expect(withoutTrailing).toEqual(trailingSpaceString.trim());
  });
});

describe('isValidDate', () => {
  const validDate = new Date('3005-01-01');
  const invalidDate = new Date('3005-01-AA');

  it('should return true when a valid date is passed', () => {
    expect(isValidDate(validDate)).toBe(true);
  });

  it('should return false when an invalid date is passed', () => {
    expect(isValidDate(invalidDate)).toBe(false);
  });
});
