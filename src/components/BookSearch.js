import { useState } from 'react';
import { Button, Grid, Container, Form, FormField } from 'semantic-ui-react';
import { MultiWordDropDown } from './MultiWordDropDown';
import { generateMapOfKeys } from '../common/utils';

const BookSearch = ({ stateBookPage, applyFilter, resetFilter, children }) => {
  const [termInput, setTermInput] = useState([]);
  const [titleInput, setTitleInput] = useState([]);
  const [subjectInput, setSubjectInput] = useState([]);
  // const firstFieldRef = useRef(null);
  // useEffect(() => {
  //   if (firstFieldRef?.current) {
  //     firstFieldRef.current.focus();
  //   }
  // }, []);

  const numerOfFilters =
    termInput.length + titleInput.length + subjectInput.length;

  const triggerApplyFilter = (e) => {
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
    setTitleInput([]);
    setSubjectInput([]);
    setTermInput([]);
    // todo check if necessary
    if (stateBookPage.filtered !== null) {
      resetFilter(e);
    }
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
              typeOfWords="general term"
              fieldLabel="Books"
              wordOptions={termInput}
              setWordOptions={setTermInput}
              // ref={firstFieldRef}
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
          <Grid.Column textAlign="left">{children}</Grid.Column>
          <Grid.Column textAlign="right">
            <Button.Group>
              <Button onClick={(e) => triggerResetFilter(e)}>
                Reset Filter
              </Button>
              <Button.Or />
              <Button
                positive
                onClick={(e) => triggerApplyFilter(e)}
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
