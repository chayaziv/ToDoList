import React from "react";
import { Link, Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Home, Login, PersonAdd, ListAlt, PowerSettingsNew } from "@mui/icons-material";
import service from "../service";

const Layout = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    service.logout();
    handleMenuClose(); // Close the menu after logout
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TodosList
          </Typography>
          <div>
            <IconButton component={Link} to="/" color="inherit">
              <Home />
            </IconButton>
            <IconButton component={Link} to="/login" color="inherit">
              <Login />
            </IconButton>
            <IconButton component={Link} to="/register" color="inherit">
              <PersonAdd />
            </IconButton>
            <IconButton component={Link} to="/todos" color="inherit">
              <ListAlt />
            </IconButton>
            <IconButton onClick={handleMenuClick} color="inherit">
              <PowerSettingsNew />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
