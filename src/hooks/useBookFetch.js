import { useState, useEffect, useRef } from 'react';
import {
  generatePageEncodedQueryUrlsObject,
  getGridLayoutByKey,
  getNumberOfPages
} from '../common/utils';

const initCache = {
  cachedBooks: [],
  lastUpdated: null,
  filterQueryStr: '',
  isAllFetched: false,
  gridLayoutKey: null
};

export const useBookFetch = (
  url,
  apiKey,
  gridLayoutKey,
  filterOptions, // filterQueryStr instead ?
  pageNumber
) => {
  const [fetchedBooks, setFetchedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [lastPage, setLastPage] = useState(-1);
  const cache = useRef(initCache);

  useEffect(() => {
    if (pageNumber < 0) {
      return;
    }
    const selectedGridLayout = getGridLayoutByKey(gridLayoutKey);
    const urlsObject = generatePageEncodedQueryUrlsObject(
      url,
      apiKey,
      selectedGridLayout,
      filterOptions,
      pageNumber
    );
    // currentCache = [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]
    // isAllFetched = false
    // booksPerPage = 10
    // retrieving second page
    // startIndex = 10
    // currentCache.length = 20
    // startIndex + booksPerPage = 20
    const currentCache = cache.current;
    if (
      currentCache.lastUpdated !== null &&
      currentCache.filterQueryStr !== urlsObject.filterQueryStr
    ) {
      // clear cache
      cache.current = { ...initCache };
    }
    if (
      currentCache.isAllFetched ||
      urlsObject.startIndex + selectedGridLayout.booksPerPage - 1 <
        currentCache.cachedBooks.length
    ) {
      // retrieve from cache
      const booksFromCache = currentCache.cachedBooks.slice(
        urlsObject.startIndex,
        urlsObject.startIndex + selectedGridLayout.booksPerPage
      );
      if (currentCache.isAllFetched) {
        const lastPage = getNumberOfPages(
          currentCache.cachedBooks,
          selectedGridLayout.booksPerPage
        );
        setLastPage(lastPage);
      }
      setIsLoading(false);
      setFetchedBooks(booksFromCache);
      console.debug(
        `Books retrieved from cache, pageNumber ${pageNumber} booksFromCache.length ${
          booksFromCache.length
        } startIndex ${urlsObject.startIndex} endIndex ${
          urlsObject.startIndex + selectedGridLayout.booksPerPage
        }`
      );
    } else {
      const fetchPromises = urlsObject.urls.map((url) =>
        fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error('Fetch response was not OK');
          }
          return response.json();
        })
      );
      let isAllFetched = false;
      Promise.all(fetchPromises)
        .then((responses) => {
          const fetchedBooks = responses.flatMap((response) => {
            if (!response.items) {
              isAllFetched = true;
              return [];
            }
            return response.items;
          });
          if (
            !isAllFetched &&
            fetchedBooks.length < selectedGridLayout.booksPerPage
          ) {
            isAllFetched = true;
          }
          if (urlsObject.startIndex > currentCache.cachedBooks.length) {
            // can occur when booksPerPage changed
            // remove books to avoid duplicates
            currentCache.cachedBooks.splice(urlsObject.startIndex);
          }
          currentCache.filterQueryStr = urlsObject.filterQueryStr;
          currentCache.isAllFetched = isAllFetched;
          currentCache.cachedBooks =
            currentCache.cachedBooks.concat(fetchedBooks);
          currentCache.lastUpdated = new Date();
          if (isAllFetched) {
            const lastPage = getNumberOfPages(
              currentCache.cachedBooks,
              selectedGridLayout.booksPerPage
            );
            setLastPage(lastPage);
          }
          setIsLoading(false);
          setFetchedBooks(fetchedBooks);
          console.debug(
            `Books fetched, pageNumber ${pageNumber} fetchedBooks.length ${
              fetchedBooks.length
            } startIndex ${urlsObject.startIndex} endIndex ${
              urlsObject.startIndex + selectedGridLayout.booksPerPage
            }`
          );
        })
        .catch((error) => {
          setFetchError(error);
          setIsLoading(false);
          console.error('Error fetching data:', error);
        });
    }
  }, [apiKey, filterOptions, gridLayoutKey, pageNumber, url]);

  return { fetchedBooks, isLoading, fetchError, lastPage };
};
