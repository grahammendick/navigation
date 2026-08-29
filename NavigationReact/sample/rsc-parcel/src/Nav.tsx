import { NavigationLink } from "navigation-react";

const Nav = () => (
    <>
        <NavigationLink stateKey="people" disableActive>People</NavigationLink>
        <NavigationLink stateKey="person" navigationData={{id: 1}} disableActive>Person</NavigationLink>
    </>
)

export default Nav;
