import { useReducer, useRef } from 'react';
import {
  Sticky,
  Menu,
  MenuItem,
  Header,
  HeaderContent
} from 'semantic-ui-react';
import { EMPTY_FILTER, getGridLayoutByKey } from '../common/utils';
import BookGrid from '../components/BookGrid';
import NavBar from '../components/NavBar';
import BookSearch from '../components/BookSearch';
import PaginationBar from '../components/PaginationBar';
import { useBookFetch } from '../hooks/useBookFetch';

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
  // const defaultLayout = Number(process.env.REACT_APP_BOOKS_LAYOUT_DEFAULT);
  // const [selectedLayoutKey, setSelectedLayoutKey] = useState(defaultLayout);
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
    console.log('applyFilter', newFilter);
    dispatch({ type: 'APPLY_FILTER', payload: newFilter });
  };
  const resetFilter = (e) => {
    e.preventDefault();
    console.log('resetFilter');
    dispatch({ type: 'RESET_FILTER' });
  };
  const handlePageChange = (e, gotoPage) => {
    e.preventDefault();
    console.log('handlePageChange, gotoPage: ', gotoPage);
    dispatch({ type: 'GOTO_PAGE', payload: gotoPage });
    //    console.log('handlePageChange, paginationData', paginationData);GOTO_PAGE
  };

  const handleGridLayoutChange = (e, selectedLayout) => {
    e.preventDefault();
    console.log('handleGridLayoutChange, selectedLayout', selectedLayout);
    dispatch({ type: 'APPLY_LAYOUT', payload: selectedLayout });
  };
  return (
    // <div class="ui centered three column grid"><div class="column"><div class="ui segment"><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><div class="ui left rail"><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><img src="/images/wireframe/paragraph.png" class="ui image"/><div class=""><div></div><div class="ui sticky"><h3 class="ui header">Stuck Content</h3><img src="/images/wireframe/image.png" class="ui image"/></div></div></div><div class="ui right rail"><div class=""><div></div><div class="ui sticky"><h3 class="ui header">Stuck Content</h3><img src="/images/wireframe/image.png" class="ui image"/></div></div></div></div></div></div>
    <>
      <NavBar />
      <div ref={usedRef}>
        <BookSearch
          stateBookPage={stateBookPage}
          applyFilter={applyFilter}
          resetFilter={resetFilter}
        />
        {stateBookPage.currentPage < 0 && (
          <Header as="h3" textAlign="center">
            <HeaderContent>
              Enter at least one term and [Apply Filter] to display books.
            </HeaderContent>
          </Header>
        )}
        {stateBookPage.currentPage > -1 && (
          <>
            <Sticky context={usedRef} offset={63}>
              <Menu
                // attached="top"
                style={{ border: 'none' }}
                borderless={true}
                size="large"
              >
                <MenuItem header>PAGE</MenuItem>
                <MenuItem>
                  <PaginationBar
                    currentPage={stateBookPage.currentPage}
                    lastPage={lastPage}
                    isLoading={isLoading}
                    selectedLayoutKey={stateBookPage.selectedLayoutKey}
                    handlePageChange={handlePageChange}
                    handleGridLayoutChange={handleGridLayoutChange}
                  />
                </MenuItem>
              </Menu>
            </Sticky>
            <BookGrid
              attached="bottom"
              bookGridData={fetchedBooks}
              columnsPerPage={selectedGridLayout.bookColumns}
              rowsPerPage={selectedGridLayout.bookRows}
              currentPage={stateBookPage.currentPage}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </>
  );
};

export default BookPage;
