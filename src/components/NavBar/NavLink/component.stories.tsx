import { Story } from "@storybook/react";
import { NavLink, NavLinkProps } from "./NavLink";
import { MemoryRouter } from "react-router-dom";

/**
 * Storybook component configuration
 */
export default {
  title: "Library/NavBar/NavLink",
  component: NavLink,
};

/**
 * Component storybook template
 */
const Template: Story<NavLinkProps> = (args) => (
  <MemoryRouter>
    <NavLink {...args} />
  </MemoryRouter>
);

/**
 * Component stories
 */
export const Component: Story<NavLinkProps> = Template.bind({});
Component.args = {};
