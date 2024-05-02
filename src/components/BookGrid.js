import React from 'react';
import { Container, Header, HeaderContent, Segment } from 'semantic-ui-react';
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
        <Header as="h3" textAlign="center">
          <HeaderContent>Loading ...</HeaderContent>
        </Header>
      </Container>
    );
  }
  return (
    <Container className="rbc-navbar-tlbr-margin">
      <Segment raised>
        {bookRows.map((bookRow, rowIndex) => (
          <BookRow
            key={`page${currentPage}row${rowIndex}id${bookRow[0].id}`}
            bookRowData={bookRow}
            columnsPerPage={columnsPerPage}
            rowsPerPage={rowsPerPage}
          />
        ))}
      </Segment>
    </Container>
  );
};

export default BookGrid;
