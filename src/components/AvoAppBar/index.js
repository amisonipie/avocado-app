import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { APPBAR_ITEMS } from "../../lib/constants";
import Logo from "../Logo";

const AvoAppBar = React.forwardRef(({ ...props }, ref) => {
  const appBarItems = APPBAR_ITEMS;
  const settings = ["Logout"];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);

    if (setting === "Logout") {
      signOut({
        callbackUrl: "/",
      });
    }
  };

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Box sx={{ display: { xs: "contents", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={props.toggleMobileMenuBar}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box>
            <Logo />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {Object.keys(appBarItems).map((index) => {
              var appBarItem = appBarItems[index];
              return (
                <Link href={appBarItem.link} key={index} passHref>
                  <Button
                    key={index}
                    onClick={handleCloseNavMenu}
                    sx={{ mx: 5, color: "black", fontSize: "16px" }}
                    startIcon={appBarItem.icon}
                  >
                    {appBarItem.title}
                  </Button>
                </Link>
              );
            })}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Avocado" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    return handleCloseUserMenu(setting);
                  }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
});

export default AvoAppBar;
