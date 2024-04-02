import React, { useState, useEffect, useRef } from 'react';

const CodeInputComponent = ({ pattern }) => {
  // Calculate the total number of inputs from the pattern
  const totalInputs = pattern.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
  const [inputValues, setInputValues] = useState(Array(totalInputs).fill(''));
  // Create a ref for each input
  const inputRefs = useRef(Array.from({ length: totalInputs }, () => React.createRef()));

  // Function to focus the input at a given index
  const focusInput = (index) => {
    if (index >= 0 && index < totalInputs) {
      inputRefs.current[index].current.focus();
    }
  };

  // Handle changes to input values, focusing the next input on input
  const handleInputChange = (value, index) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = value[0] || ''; // Only take the first character
    setInputValues(updatedValues);

    if (value && index < totalInputs - 1) {
      focusInput(index + 1);
    }
  };

  // Handle key down events for navigation and deletion
  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && inputValues[index] === '' && index > 0) {
      focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < totalInputs - 1) {
      focusInput(index + 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    }
  };

  // Handle pasting content, spreading it across the inputs
  const handlePaste = (event, startIndex) => {
    event.preventDefault();
    const pasteContent = event.clipboardData.getData('text').split('');
    let updatedValues = [...inputValues];
    let nextIndex = startIndex;

    for (let i = 0; i < pasteContent.length; i++) {
      if (nextIndex >= totalInputs) {
        nextIndex = 0; // Wrap around if necessary
      }
      updatedValues[nextIndex] = pasteContent[i];
      nextIndex++;
    }

    setInputValues(updatedValues);
    focusInput(nextIndex < totalInputs ? nextIndex : 0);
  };

  // Render the inputs based on the pattern
  const renderInputs = () => {
    let inputIndex = 0;
    return pattern.map((element, patternIndex) => {
      if (typeof element === 'number') {
        return Array.from({ length: element }).map((_, index) => {
          const currentIndex = inputIndex;
          inputIndex += 1;
          return (
            <input
              key={`${patternIndex}-${index}`}
              ref={inputRefs.current[currentIndex]}
              value={inputValues[currentIndex]}
              onChange={(e) => handleInputChange(e.target.value, currentIndex)}
              onKeyDown={(e) => handleKeyDown(e, currentIndex)}
              onPaste={(e) => handlePaste(e, currentIndex)}
              maxLength={1}
            />
          );
        });
      }
      return null; // If the element isn't a number, don't render anything
    });
  };

  // Handle the submission of the form
  const handleSubmit = () => {
    let alertString = '';
    let inputCounter = 0;

    pattern.forEach((element, index) => {
      if (typeof element === 'number') {
        alertString += inputValues.slice(inputCounter, inputCounter + element).join('');
        inputCounter += element;
      } else {
        alertString += element;
      }
    });

    alert(alertString);
  };

  return (
    <div>
      {renderInputs()}
      <hr />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CodeInputComponent;