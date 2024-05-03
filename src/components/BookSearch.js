import { useState } from 'react';
import { Button, Grid, Container, Form, FormField } from 'semantic-ui-react';
import { MultiWordDropDown } from './MultiWordDropDown';
import { generateMapOfKeys } from '../common/utils';

const BookSearch = ({ stateBookPage, applyFilter, resetFilter, children }) => {
  const [keyCount, setKeyCount] = useState(0);
  const [termInput, setTermInput] = useState([]);
  const [titleInput, setTitleInput] = useState([]);
  const [subjectInput, setSubjectInput] = useState([]);

  const termOptions = [...termInput];

  const numerOfFilters =
    termInput.length + titleInput.length + subjectInput.length;

  const triggerApplyFilter = (e) => {
    e.preventDefault();
    if (numerOfFilters < 1) {
      // do nothing
    } else {
      const newFilter = Object.assign(
        {},
        {
          status: 'applying',
          termInput: generateMapOfKeys(termInput, 'key'),
          titleInput: generateMapOfKeys(titleInput, 'key'),
          subjectInput: generateMapOfKeys(subjectInput, 'key')
        }
      );
      applyFilter(e, newFilter);
    }
  };
  const triggerResetFilter = (e) => {
    e.preventDefault();
    setKeyCount((prev) => prev + 1);
    setTitleInput([]);
    setSubjectInput([]);
    setTermInput([]);
    resetFilter(e);
  };

  return (
    <div className="rbc-non-transparant-bg">
      <Container className="rbc-padding-top-1em rbc-padding-bottom-1em">
        <Form onSubmit={(e) => applyFilter(e)}>
          <FormField>
            <label>
              Search Term (Required, at least 1 term must be entered to display
              books)
            </label>
            <MultiWordDropDown
              key={`mWDD_${keyCount}`}
              typeOfWords="general term"
              fieldLabel="Books"
              wordOptions={termOptions}
              setWordOptions={setTermInput}
              wordOptionsValue={termInput}
              onClearAll={triggerResetFilter}
            />
          </FormField>
          {/* <FormField>
            <label>Search Title</label>
            <MultiWordDropDown
              typeOfWords="term"
              fieldLabel="Title field"
              wordOptions={titleInput}
              setWordOptions={setTitleInput}
            />
          </FormField>
          <FormField>
            <label>Search Subject</label>
            <MultiWordDropDown
              typeOfWords="term"
              fieldLabel="Subject field"
              wordOptions={subjectInput}
              setWordOptions={setSubjectInput}
            />
          </FormField> */}
        </Form>
      </Container>
      <Container>
        <Grid columns={2}>
          <Grid.Column textAlign="left">
            {stateBookPage.currentPage > -1 && children}
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Button.Group>
              <Button onClick={triggerResetFilter}>Reset Filter</Button>
              <Button.Or />
              <Button
                positive
                onClick={triggerApplyFilter}
                disabled={numerOfFilters < 1}
              >
                Apply Filter
              </Button>
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
};
export default BookSearch;
