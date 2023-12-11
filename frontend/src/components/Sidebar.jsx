import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return (
      <div className='sidebar'>
        <CDBSidebar textColor='#fff' bg-dark>
          <CDBSidebarHeader prefix={<i className='fa fa-bars fa-large'></i>}>
            <a
              href='/'
              className='text-decoration-none'
              style={{ color: "inherit" }}
            ></a>
          </CDBSidebarHeader>

          <CDBSidebarContent className='sidebar-content'>
            <CDBSidebarMenu>
              <NavLink to='/' activeclassname='activeClicked'>
                <CDBSidebarMenuItem icon='th-large'>
                  Dashboard
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink to='/all' activeclassname='activeClicked'>
                <CDBSidebarMenuItem icon='laptop'>Devices</CDBSidebarMenuItem>
              </NavLink>
              <NavLink to='/applications' activeclassname='activeClicked'>
                <CDBSidebarMenuItem icon='book'>
                  Applications
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink to='/profiles' activeclassname='activeClicked'>
                <CDBSidebarMenuItem icon='clipboard'>
                  Profiles
                </CDBSidebarMenuItem>
              </NavLink>
              <NavLink to='/users' activeclassname='activeClicked'>
                <CDBSidebarMenuItem icon='users'>Users </CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    );
  }
}

export default Sidebar;
