import {
  Icon,
  Button,
  ButtonGroup,
  Dropdown,
  SegmentInline
} from 'semantic-ui-react';
import { BOOKS_GRID_LAYOUTS_OPTIONS } from '../common/utils';

const PaginationBar = ({
  currentPage,
  lastPage,
  isLoading,
  selectedLayoutKey,
  handlePageChange,
  handleGridLayoutChange
}) => {
  //   const defaultLayout = Number(process.env.REACT_APP_BOOKS_LAYOUT_DEFAULT);
  //   const [selectedLayoutKey, setSelectedLayoutKey] = useState(defaultLayout);
  const layoutOptions = [...BOOKS_GRID_LAYOUTS_OPTIONS];
  function handleClick(e, action) {
    let gotoPage = 1;
    switch (action) {
      case 'previous-page':
        gotoPage = currentPage - 1;
        break;
      case 'next-page':
        gotoPage = currentPage + 1;
        if (lastPage > -1 && gotoPage > lastPage) {
          gotoPage = lastPage;
        }
        break;
      default:
        break;
    }
    handlePageChange(e, gotoPage);
  }
  function handleGridLayout(e, data) {
    handleGridLayoutChange(e, data.value);
  }
  return (
    <SegmentInline>
      <ButtonGroup>
        <Button
          icon
          onClick={(e) => handleClick(e, 'first-page')}
          disabled={currentPage < 2 || isLoading}
        >
          <Icon name="angle double left" />
        </Button>
        <Button
          icon
          onClick={(e) => handleClick(e, 'previous-page')}
          disabled={currentPage < 2 || isLoading}
        >
          <Icon name="angle left" />
        </Button>
        <Button disabled>{currentPage}</Button>
        <Button
          icon
          onClick={(e) => handleClick(e, 'next-page')}
          disabled={currentPage === lastPage || isLoading}
        >
          <Icon name="angle right" />
        </Button>
      </ButtonGroup>
      <Dropdown
        placeholder="Select Layout"
        // fluid
        compact
        selection
        multiple={false}
        options={layoutOptions}
        onChange={handleGridLayout}
        value={selectedLayoutKey}
      />
    </SegmentInline>
  );
};

export default PaginationBar;
