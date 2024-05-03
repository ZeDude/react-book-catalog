import React from 'react';
import { Dropdown } from 'semantic-ui-react';

export const MultiWordDropDown = ({
  typeOfWords = 'word',
  fieldLabel,
  wordOptions,
  setWordOptions,
  wordOptionsValue,
  onClearAll
}) => {
  // const [wordOption, setWordOption] = useState('');
  console.log('MultiWordDropDown wordOptions: ', wordOptions);
  console.log('MultiWordDropDown wordOptionsValue: ', wordOptionsValue);
  const placeHolder = `Type a ${typeOfWords} and enter `;
  const noResultsMessage = `Adding multiple ${typeOfWords}s => ${fieldLabel} should include ALL the ${typeOfWords}s`;
  function onChange(event, data) {
    // event.preventDefault();
    if (event?.type === 'click') {
      // word removed from selection
      if (event?.target?.className === 'delete icon') {
        setWordOptions((prevOpts) =>
          prevOpts.filter((opt) => (data.value || []).includes(opt.key))
        );
      }
      // all words removed from selection
      if (event?.target?.className === 'dropdown icon clear') {
        setWordOptions([]);
        if (typeof onClearAll === 'function') {
          onClearAll(event);
        }
      }
    }
  }
  // dropdown icon clear
  function addItemHandler(event, data) {
    const newVal = data?.value ? data.value.toLowerCase() : '';
    if (newVal) {
      // if (!Array.isArray(wordOptions)) {
      //   // if (wordOptions === '') {
      //   //   setWordOptions(newVal);
      //   // } else
      //   if (wordOptions !== newVal) {
      //     const newArray = [newVal];
      //     setWordOptions(newArray);
      //   }
      // } else {
      const optionExists = wordOptions.find((opt) => opt.key === newVal);
      if (!optionExists) {
        setWordOptions((prevOpts) => [
          ...prevOpts,
          {
            key: newVal,
            text: data.value,
            value: newVal
          }
        ]);
        // }
      }
    }
  }
  return (
    <Dropdown
      placeholder={placeHolder}
      fluid
      search
      selection
      multiple
      allowAdditions
      closeOnChange
      clearable
      onAddItem={addItemHandler}
      onChange={onChange}
      options={wordOptions}
      noResultsMessage={noResultsMessage}
    />
  );
};
