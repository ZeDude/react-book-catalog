import React from 'react';
import { Dropdown } from 'semantic-ui-react';

export const MultiWordDropDown = ({
  typeOfWords = 'word',
  fieldLabel,
  wordOptions,
  setWordOptions
}) => {
  const placeHolder = `Type a ${typeOfWords} and enter `;
  const noResultsMessage = `Adding multiple ${typeOfWords}s => ${fieldLabel} should include ALL the ${typeOfWords}s`;
  function onChange(event, data) {
    event.preventDefault();
    // word removed from selection
    if (event?.type === 'click' && event?.target?.className === 'delete icon') {
      setWordOptions((prevOpts) =>
        prevOpts.filter((opt) => (data.value || []).includes(opt.key))
      );
    }
  }
  function addItemHandler(event, data) {
    const newVal = data?.value ? data.value.toLowerCase() : '';
    if (newVal) {
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
      onAddItem={addItemHandler}
      onChange={onChange}
      options={wordOptions}
      noResultsMessage={noResultsMessage}
    />
  );
};
