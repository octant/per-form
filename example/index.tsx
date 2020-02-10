import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Form, { IFormControls } from './templates/Form';
import schema from './vehicle-schema';

const App = () => {
  const vehicleFormRef = React.createRef<IFormControls>();
  const [isValid, setIsValid] = React.useState(false);

  function handleChange(_: string, values: any) {
    setIsValid(values.isValid);
  }

  function handleSubmit() {
    const { current } = vehicleFormRef;

    console.log(current && current.submit());
  }

  function handleReset() {
    const { current } = vehicleFormRef;

    current && current.reset();
  }

  return (
    <div>
      <Form
        name="vehicle"
        form={schema.new}
        onChange={handleChange}
        ref={vehicleFormRef}
        initialValues={{ make: 'Ford', model: 'fusion', year: 2011 }}
      />
      <button onClick={handleSubmit} disabled={!isValid}>
        Submit
      </button>{' '}
      | <button onClick={handleReset}>Reset</button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
