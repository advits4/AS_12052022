import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
return (
	<>
	<Nav>
		<NavMenu>
            <NavLink to="/">
                Home
            </NavLink>
            <NavLink to="/add" >
                Add
            </NavLink>
            <NavLink to="/upload">
                Upload
            </NavLink>
            <NavLink to="/list">
                List
            </NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;

