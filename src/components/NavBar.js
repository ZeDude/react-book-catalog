import React from 'react';
import { Image, Menu, MenuItem } from 'semantic-ui-react';

function NavBar() {
  // const [activeItem, setActiveItem] = useState('home');

  // const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu
      fixed="top"
      style={{ border: 'none' }}
      borderless={true}
      size="large"
      inverted
    >
      <Menu.Item as="a" header>
        <Image style={{ height: '35px' }} src="/images/logo.png" />
      </Menu.Item>
      <MenuItem header>Fred's Book Catalog</MenuItem>
      {/* <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === 'login'}
          onClick={handleItemClick}
        />

        <Menu.Item
          name="signup"
          active={activeItem === 'signup'}
          onClick={handleItemClick}
        />
      </Menu.Menu> */}
    </Menu>
  );
}

export default NavBar;
