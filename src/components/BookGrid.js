import React from 'react';
import { Container, Dimmer, Image, Loader, Segment } from 'semantic-ui-react';
import BookRow from './BookRow';
import { splitArrayInChunksOfSize } from '../common/utils';

const BookGrid = ({
  bookGridData,
  columnsPerPage,
  rowsPerPage,
  currentPage,
  isLoading
}) => {
  // split bookGridData = books displayed on page, into book rows, number of books in a row according to columns per page
  const bookRows = splitArrayInChunksOfSize(bookGridData, columnsPerPage);
  if (isLoading) {
    return (
      <Container className="rbc-navbar-tlbr-margin">
        <Segment>
          <Dimmer active inverted>
            <Loader size="medium">Loading</Loader>
          </Dimmer>

          <Image src="/images/paragraph.png" />
        </Segment>
      </Container>
    );
  }
  if (currentPage < 0) {
    return <></>;
  }
  const bookGrid = bookRows.map((bookRow, rowIndex) => (
    <BookRow
      key={`page${currentPage}row${rowIndex}id${bookRow[0].id}`}
      bookRowData={bookRow}
      columnsPerPage={columnsPerPage}
      rowsPerPage={rowsPerPage}
    />
  ));
  return (
    <Container className="rbc-navbar-tlbr-margin">
      <Segment raised>{bookGrid}</Segment>
    </Container>
  );
};

export default BookGrid;
