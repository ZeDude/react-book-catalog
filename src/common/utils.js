/* prettier-ignore */
export const splitArrayInChunksOfSize = (arr, sizeOfChunk) => {
  if (!Array.isArray(arr) || arr.length < 1) {
    return [];
  }
  const numberOfChunks = Math.ceil(arr.length / sizeOfChunk);
  const arrayOfChunks = [];
  let chunkNr = 0;
  while (chunkNr < numberOfChunks) {
    arrayOfChunks.push(arr.slice(chunkNr * sizeOfChunk, (chunkNr * sizeOfChunk) + sizeOfChunk));
    chunkNr++;
  }
  return arrayOfChunks;
  // return Array.from({ length: sizeOfChunk }, (v, index) =>
  //   arr.slice(index * numberOfChunks, (index * numberOfChunks) + numberOfChunks)
  // );
};
export const getNumberOfPages = (dataArray, recordsPerPage) => {
  /* prettier-ignore */
  return (dataArray === null || dataArray.length < 1)
    ? 0
    : Math.floor((dataArray.length - 1) / recordsPerPage) + 1;
};

const createOptionFromValue = (val) => {
  return { key: val, text: val, value: val };
};

export const createOptionsFromArray = (array) => {
  const options = array.map((val) => createOptionFromValue(val));
  return options;
};

export const createRangeOptionsArray = (min, max) => {
  var array = [];
  for (let i = min; i <= max; i++) {
    array.push(i);
  }
  return createOptionsFromArray(array);
};

export const EMPTY_FILTER = {
  status: 'empty',
  termInput: [],
  titleInput: [],
  subjectInput: []
};

export const BOOKS_GRID_LAYOUTS = [
  { booksPerPage: 10, bookColumns: 5, bookRows: 2, maxResults: 10 },
  { booksPerPage: 25, bookColumns: 5, bookRows: 5, maxResults: 25 },
  { booksPerPage: 50, bookColumns: 5, bookRows: 10, maxResults: 25 }
];

export const BOOKS_GRID_LAYOUTS_OPTIONS = BOOKS_GRID_LAYOUTS.map((layout) => {
  return {
    key: layout.booksPerPage,
    text: `${layout.booksPerPage} books per page`,
    value: layout.booksPerPage
  };
});

export const getGridLayoutByKey = (booksPerPage) => {
  return BOOKS_GRID_LAYOUTS.find(
    (layout) => layout.booksPerPage === booksPerPage
  );
};

console.log('BOOKS_GRID_LAYOUTS_OPTIONS', BOOKS_GRID_LAYOUTS_OPTIONS);

/* prettier-ignore */
export const generateFilterQueryString = (filterOptions, apiKey) => {
  const queryStr = `q=${filterOptions.termInput.join('+')}${
      filterOptions.titleInput.length > 0
        ? '&intitle=' + filterOptions.titleInput.join('+')
        : ''
    }${
    filterOptions.subjectInput.length > 0
      ? '&subject=' + filterOptions.subjectInput.join('+')
      : ''
  }&printType=books&key=${apiKey}`;
  return queryStr;
};

export const generatePageChunkQueryStr = (gridLayout, startIndex) => {
  const queryStr = `&maxResults=${gridLayout.maxResults}&startIndex=${startIndex}`;
  return queryStr;
};
/*
returns:
{
    urls: [],
    filterQueryStr:
    startIndex:
}
*/
export const generatePageEncodedQueryUrlsObject = (
  url,
  apiKey,
  gridLayout,
  filterOptions,
  pageNumber
) => {
  const chunksOfSize = gridLayout.maxResults;
  const filterQueryStr = generateFilterQueryString(filterOptions, apiKey);
  let result = [];
  let startIndex = 0;
  let chunkNumber = 0;
  const page = pageNumber > 0 ? pageNumber - 1 : pageNumber;
  while (chunkNumber * chunksOfSize < gridLayout.booksPerPage) {
    /* prettier-ignore */
    const start =  (page * gridLayout.booksPerPage) + (chunkNumber * gridLayout.maxResults);
    if (chunkNumber === 0) {
      startIndex = start;
    }
    const pageChunkQueryStr = generatePageChunkQueryStr(gridLayout, start);
    const urlAndQueryStr = `${url}?${filterQueryStr}${pageChunkQueryStr}`;
    result.push(urlAndQueryStr);
    chunkNumber++;
  }
  return {
    urls: result,
    filterQueryStr,
    startIndex
  };
};

export const generateMapOfKeys = (arrayOfObject, fieldName) => {
  return arrayOfObject.map((obj) => {
    if (checkIfObject(obj)) {
      return obj[fieldName];
    }
    return obj;
  });
};

export const checkIfObject = (val) => {
  return typeof val === 'object' && !Array.isArray(val) && val !== null;
};
