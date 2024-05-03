import { useReducer, useRef } from 'react';
import { Header, HeaderContent, Sticky } from 'semantic-ui-react';
import { EMPTY_FILTER, getGridLayoutByKey } from '../common/utils';
import BookGrid from '../components/BookGrid';
import NavBar from '../components/NavBar';
import { useBookFetch } from '../hooks/useBookFetch';
import BookGridController from '../components/BookGridController';

const initialState = {
  currentPage: -1,
  bookData: [],
  filtered: null,
  filterOptions: {
    termInput: [],
    titleInput: [],
    subjectInput: []
  },
  selectedLayoutKey: 50,
  lastPage: -1,
  status: 'init'
};

const reducerBookData = (state, action) => {
  let newState = null;
  switch (action.type) {
    case 'INIT_PAGE':
      newState = Object.assign({}, state, {
        currentPage: action.payload.page,
        status: 'loaded'
      });
      return newState;
    case 'GOTO_PAGE':
      newState = Object.assign({}, state, {
        currentPage: action.payload
      });
      return newState;
    case 'APPLY_LAYOUT':
      newState = Object.assign({}, state, {
        currentPage: 1,
        selectedLayoutKey: action.payload
      });
      return newState;
    case 'CLEAR_FILTER':
      return Object.assign({}, state, {
        currentPage: -1,
        bookData: [],
        status: 'init',
        filterOptions: EMPTY_FILTER
      });
    case 'APPLY_FILTER':
      newState = Object.assign({}, state, {
        currentPage: 1,
        status: 'applying',
        filterOptions: {
          termInput: [...action.payload.termInput],
          titleInput: [...action.payload.titleInput],
          subjectInput: [...action.payload.subjectInput]
        }
      });
      return newState;
    default:
      console.error('reducerBookData, Invalid action type: ', action?.type);
      return state;
  }
};

const BookPage = () => {
  const [stateBookPage, dispatch] = useReducer(reducerBookData, initialState);
  const selectedGridLayout = getGridLayoutByKey(
    stateBookPage.selectedLayoutKey
  );
  const usedRef = useRef();
  const googleBookApiUrl = process.env.REACT_APP_GOOGLE_BOOK_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const { fetchedBooks, isLoading, fetchError, lastPage } = useBookFetch(
    googleBookApiUrl,
    apiKey,
    stateBookPage.selectedLayoutKey,
    stateBookPage.filterOptions,
    stateBookPage.currentPage
  );

  const applyFilter = (e, newFilter) => {
    e.preventDefault();
    dispatch({ type: 'APPLY_FILTER', payload: newFilter });
  };
  const resetFilter = (e) => {
    e.preventDefault();
    dispatch({ type: 'RESET_FILTER' });
  };
  const handlePageChange = (e, gotoPage) => {
    e.preventDefault();
    dispatch({ type: 'GOTO_PAGE', payload: gotoPage });
  };

  const handleGridLayoutChange = (e, selectedLayout) => {
    e.preventDefault();
    dispatch({ type: 'APPLY_LAYOUT', payload: selectedLayout });
  };
  return (
    <>
      <NavBar />

      <div ref={usedRef} style={{ paddingTop: '63px' }}>
        <Sticky context={usedRef} offset={63}>
          <BookGridController
            stateBookPage={stateBookPage}
            applyFilter={applyFilter}
            resetFilter={resetFilter}
            lastPage={lastPage}
            isLoading={isLoading}
            handlePageChange={handlePageChange}
            handleGridLayoutChange={handleGridLayoutChange}
          />
          {stateBookPage.currentPage < 0 && (
            <Header as="h3" textAlign="center">
              <HeaderContent>
                Enter at least one term and [Apply Filter] to display books.
              </HeaderContent>
            </Header>
          )}
        </Sticky>
        {stateBookPage.currentPage > -1 && (
          <BookGrid
            attached="bottom"
            bookGridData={fetchedBooks}
            columnsPerPage={selectedGridLayout.bookColumns}
            rowsPerPage={selectedGridLayout.bookRows}
            currentPage={stateBookPage.currentPage}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
};

export default BookPage;
