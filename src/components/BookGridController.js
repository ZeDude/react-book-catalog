import BookSearch from './BookSearch';
import PaginationBar from './PaginationBar';

const BookGridController = ({
  stateBookPage,
  applyFilter,
  resetFilter,
  //   currentPage,
  lastPage,
  isLoading,
  //   selectedLayoutKey,
  handlePageChange,
  handleGridLayoutChange
}) => {
  return (
    <BookSearch
      stateBookPage={stateBookPage}
      applyFilter={applyFilter}
      resetFilter={resetFilter}
      currentPage={stateBookPage.currentPage}
      lastPage={lastPage}
      isLoading={isLoading}
      selectedLayoutKey={stateBookPage.selectedLayoutKey}
      handlePageChange={handlePageChange}
      handleGridLayoutChange={handleGridLayoutChange}
    >
      {stateBookPage.currentPage > -1 && (
        <PaginationBar
          currentPage={stateBookPage.currentPage}
          lastPage={lastPage}
          isLoading={isLoading}
          selectedLayoutKey={stateBookPage.selectedLayoutKey}
          handlePageChange={handlePageChange}
          handleGridLayoutChange={handleGridLayoutChange}
        />
      )}
    </BookSearch>
  );
};
export default BookGridController;
