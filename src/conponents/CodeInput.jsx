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
    if (!isNaN(value) && value !== ' ') {
        const updatedValues = [...inputValues];
        updatedValues[index] = value[0] || ''; // Only take the first character
        setInputValues(updatedValues);
        if (value && index < totalInputs - 1 && updatedValues[index].length > 0) {
            focusInput(index + 1);
        }
    } else if (value === ' ') {
        const updatedValues = [...inputValues];
        updatedValues[index] = ''; // Clear the input if space is entered
        setInputValues(updatedValues);
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
    let updatedValues = Array(totalInputs).fill(''); // Reset all input values
    let nextIndex = 0; // Start pasting from the beginning
    for (let i = 0; i < pasteContent.length; i++) {
      if (nextIndex >= totalInputs) {
        nextIndex = 0; // Wrap around if necessary
      }
      updatedValues[nextIndex] = pasteContent[i];
      nextIndex++;
    }
    setInputValues(updatedValues);
    focusInput(startIndex); // Focus on the first input field after pasting
  };

  // Render the inputs based on the pattern
  const renderInputs = () => {
    let inputIndex = 0;
    let separatorIndex = 0;
    const separatorStyle = {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '10px',
    };
    return pattern.map((element, patternIndex) => {
      if (typeof element === 'number') {
        const inputs = Array.from({ length: element }).map((_, index) => {
          const currentIndex = inputIndex;
          inputIndex += 1;
          return (
            <React.Fragment key={`${patternIndex}-${index}`}>
              <input
                ref={inputRefs.current[currentIndex]}
                value={inputValues[currentIndex]}
                onChange={(e) => handleInputChange(e.target.value, currentIndex)}
                onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                onPaste={(e) => handlePaste(e, currentIndex)}
                maxLength={1}
              />
            </React.Fragment>
          );
        });
        separatorIndex += 1;
        return inputs;
      } else {
        return (
          <span key={`separator-${patternIndex}`} style={separatorStyle}>
            {element}
          </span>
        );
      }
    });
  };

  // Handle the submission of the form
const handleSubmit = () => {
    let alertString = '';
    let inputCounter = 0;
    let isInputIncomplete = false;
    
    pattern.forEach((element, index) => {
        if (typeof element === 'number') {
            const inputValuesSlice = inputValues.slice(inputCounter, inputCounter + element);
            if (inputValuesSlice.includes('')) {
                isInputIncomplete = true;
            }
            alertString += inputValuesSlice.join('');
            inputCounter += element;
        } else {
            alertString += element;
        }
    });

    if (isInputIncomplete) {
        alert('Proszę uzupełnić pola.');
    } else {
        alert(alertString);
    }
};

  return (
    <div className='codeInput'>
      {renderInputs()}
      <hr />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CodeInputComponent;