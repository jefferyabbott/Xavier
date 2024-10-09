import { useMemo } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

// Navigation items configuration
const NAV_ITEMS = [
  {
    to: "/",
    icon: "th-large",
    label: "Dashboard",
  },
  {
    to: "/all",
    icon: "laptop",
    label: "Devices",
  },
  {
    to: "/applications",
    icon: "book",
    label: "Applications",
  },
  {
    to: "/profiles",
    icon: "clipboard",
    label: "Profiles",
  },
  {
    to: "/users",
    icon: "users",
    label: "Users",
  },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const renderNavItems = useMemo(() => {
    return NAV_ITEMS.map(({ to, icon, label }) => (
      <NavLink 
        key={to} 
        to={to} 
        className={({ isActive }) => 
          isActive ? "activeClicked" : undefined
        }
      >
        <CDBSidebarMenuItem icon={icon}>
          {label}
        </CDBSidebarMenuItem>
      </NavLink>
    ));
  }, []);

  if (!user) {
    return null;
  }

  return (
    <aside className="sidebar h-screen">
      <CDBSidebar 
        textColor="#fff" 
        className="bg-dark min-h-screen"
      >
        <CDBSidebarHeader 
          prefix={
            <i className="fa fa-bars fa-large hover:opacity-80 transition-opacity" />
          }
        >
          <NavLink 
            to="/" 
            className="text-decoration-none hover:opacity-80 transition-opacity"
            style={{ color: "inherit" }}
          >
            <span className="font-semibold">Admin Portal</span>
          </NavLink>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            {renderNavItems}
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </aside>
  );
}
