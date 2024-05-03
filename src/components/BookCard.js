import React from 'react';
import { Card, Grid, Image } from 'semantic-ui-react';

function BookCard({ id, title, description = '', imageLink }) {
  const len = description.length;
  const suffix = len > 600 ? ' ...' : '';
  const descDiplay =
    len < 1
      ? 'No description available.'
      : description.substring(0, 600) + suffix;
  const previewLink = `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=3&edge=curl&source=gbs_api`;
  const onImageError = (e) => {
    if (imageLink) {
      e.target.src = imageLink;
    }
  };

  return (
    <Grid.Column>
      <Card>
        <Image
          src={previewLink}
          fluid
          // size="small"
          alt={title}
          wrapped
          ui={false}
        />
        {/* <img
          src={previewLink}
          // height={300}
          alt={title}
          onError={onImageError}
        /> */}

        <Card.Content>
          <Card.Header>{title}</Card.Header>
          <Card.Description>{descDiplay}</Card.Description>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

export default BookCard;
