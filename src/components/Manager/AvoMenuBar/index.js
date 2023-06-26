import { Grid, ListItemButton, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { DRAWER_WIDTH, MENUBAR_ITEMS } from "../../../lib/constants";
import styles from "./AvoMenuBar.module.css";
const AvoMenuBar = React.forwardRef(({ ...props }, ref) => {
  const router = useRouter();
  const menuBarItems = MENUBAR_ITEMS;
  const restaurantName = useSelector((state) => {
    return state.restaurant.name;
  });

  const setHoverStyles = (index) => {
    const icons = document.querySelector(`.icon-spacing-${index}`);
    const path = icons.getElementsByTagName("path");
    if (path.length > 1) {
      Array.from(path).forEach(function (pathItem) {
        pathItem.style.fill = "#9FBF3B";
      });
    } else {
      path[0].style.fill = "#9FBF3B";
    }
  };

  const unsetHoverStyles = (index) => {
    const icons = document.querySelector(`.icon-spacing-${index}`);
    const path = icons.getElementsByTagName("path");
    if (path.length > 1) {
      Array.from(path).forEach(function (pathItem) {
        pathItem.style.fill = "#9FBF3B80";
      });
    } else {
      path[0].style.fill = "#9FBF3B80";
    }
  };

  const isActive = (menuName) => {
    return menuName === router.pathname;
  };

  return (
    <Grid container item direction="row">
      <Grid item sx={{ width: DRAWER_WIDTH }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              backgroundColor: "#DCE7BA",
            },
          }}
          open={props.showMobileMenuBar}
        >
          <Toolbar />
          <Typography className="title" my={3}>
            {restaurantName}
          </Typography>
          <Grid item sx={{ overflow: "auto" }}>
            <List>
              {Object.keys(menuBarItems).map((index) => {
                var menuBarItem = menuBarItems[index];
                return (
                  <Link href={menuBarItem.link} key={index} passHref>
                    <ListItemButton
                      selected={isActive(menuBarItem.link)}
                      key={index}
                      className={`${styles["list-item"]}`}
                      onMouseEnter={() => {
                        setHoverStyles(index);
                      }}
                      onMouseLeave={() => {
                        unsetHoverStyles(index);
                      }}
                    >
                      <ListItemIcon className={`icon-spacing-${index}`}>
                        {menuBarItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        className={styles["list-item-text"]}
                        primary={
                          <Typography
                            fontWeight={
                              isActive(menuBarItem.link) ? 800 : "normal"
                            }
                            color="#40663C"
                          >
                            {menuBarItem.title}
                          </Typography>
                        }
                        classes={{
                          root: {
                            fontWeight: isActive(menuBarItem.link) ?? 800,
                          },
                        }}
                      />
                    </ListItemButton>
                  </Link>
                );
              })}
            </List>
          </Grid>
        </Drawer>
      </Grid>
      <Grid item sx={{ flex: 1, padding: "25px 100px 25px 25px" }}>
        {props.children}
      </Grid>
    </Grid>
  );
});

export default AvoMenuBar;
