import useForm from '../useForm';
import { schemaDefinition } from './schema';
import { renderHook } from '@testing-library/react-hooks';

const passedValues = { name: 'Foo', rating: 1 };

const { result } = renderHook(() =>
  useForm({
    name: 'test',
    schema: schemaDefinition,
    passedValues: passedValues,
  })
);

describe('Form', () => {
  const { values } = result.current;

  it('should return a form with values set to default', () => {
    expect(values.name).toEqual('Foo');
    expect(values.code).toEqual('');
    expect(values.description).toEqual('');
    expect(values.rating).toEqual(1.0);
  });
});
