import './App.css';

import { useState, FormEventHandler } from 'react';
import { TextField } from './Field/Field';
import { Form } from './Form/Form';

function App() {
  const [result, setResult] = useState<Record<string, FormDataEntryValue>>();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    // Dummy submit handler.
    event.preventDefault();
    setResult(Object.fromEntries(new FormData(event.currentTarget)));
  };

  return (
    <div className="App">
      <h1>React + HTML5 Validation</h1>
      <div>
        <Form className="form" action="" onSubmit={handleSubmit}>
          <TextField
            name="firstName"
            label="First name"
            required
            unstable_customValidation="q"
          />
          <TextField name="email" label="Email" type="email" required />

          <button type="submit">Submit</button>

          {result ? (
            <div>
              Results
              <pre>
                <>{JSON.stringify(result, undefined, 2)}</>
              </pre>
            </div>
          ) : null}
        </Form>
      </div>
    </div>
  );
}

export default App;
