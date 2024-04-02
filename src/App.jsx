import React from 'react';
import CodeInput from './conponents/CodeInput';

const ExampleComponent = () => {
  const handleSubmit = (code) => {
    alert(`Submitted code: ${code}`);
  };

  return (
    <div>
      <p><b>Szymon Ciurkiewicz</b> - zadanie rekrutacyjne (potwierdzenie kodu weryfikacyjnego)</p>
      <h3>Wpisz kod weryfikacyjny 👇</h3>
      <CodeInput pattern={[2, '-', 1, '=', 3]} />
    </div>
  );
};

export default ExampleComponent;
