import React from 'react';
import { Grid } from 'semantic-ui-react';

import BookCard from './BookCard.js';

function BookRow({ bookRowData, columnsPerPage }) {
  return (
    <Grid>
      <Grid.Row columns={columnsPerPage} stretched>
        {Array.isArray(bookRowData) &&
          bookRowData.map((bookData) => {
            const {
              id,
              volumeInfo: { title, description }
            } = bookData;
            let thumbnail = null;
            if (bookData?.volumeInfo?.imageLinks?.thumbnail) {
              thumbnail = bookData?.volumeInfo?.imageLinks?.thumbnail;
            }
            return (
              <BookCard
                key={`card${bookData.id}`}
                id={id}
                title={title}
                imageLink={thumbnail}
                description={description}
              />
            );
          })}
      </Grid.Row>
    </Grid>
  );
}

export default BookRow;
