import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import { getCsrfToken, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MENUBAR_ITEMS, SEVERITY } from "../../../../lib/constants";
import { useDeleteRestaurantItemMutation } from "../../../../pages/api/restaurant/restaurantApi";
import { requireAuthentication } from "../../../../pages/api/util/requireAuthentication";
import { showAlert } from "../../../../store/slice/alertSlice";
import { setRestaurantData } from "../../../../store/slice/restaurantSlice";
import DeletModal from "../../../DeletModal";
import styles from "./LocationCard.module.css";

const DELETE_RESTAURANT = "Delete Restaurant";

const LocationCard = React.forwardRef(({ id, name, address, ...rest }, ref) => {
  const menuBarItems = MENUBAR_ITEMS;
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [restoAddress, setrestoAddress] = useState("");
  const [deletemodal, setDeleteModal] = useState(false);
  const [deleteRestaurantItem] = useDeleteRestaurantItemMutation()
  const handleClick = (menuItemTitle) => {
    // if it is "Menu", dispatch restaurant id to store.
    dispatch(
      setRestaurantData({
        id,
        name,
        address,
        ...rest,
      })
    );
  };

  useEffect(() => {
    if (!isEmpty(address)) {
      const { city, state } = address;
      setrestoAddress(`${city}, ${state}`);
    }
  }, [address]);

  const setHoverStyles = (id, index) => {
    const icons = document.querySelector(`.icon-spacing-${id}-${index}`);
    const path = icons.getElementsByTagName("path");
    if (path.length > 1) {
      Array.from(path).forEach(function (pathItem) {
        pathItem.style.fill = "#9FBF3B";
      });
    } else {
      path[0].style.fill = "#9FBF3B";
    }
  };

  const unsetHoverStyles = (id, index) => {
    const icons = document.querySelector(`.icon-spacing-${id}-${index}`);
    const path = icons.getElementsByTagName("path");
    if (path.length > 1) {
      Array.from(path).forEach(function (pathItem) {
        pathItem.style.fill = "#9FBF3B80";
      });
    } else {
      path[0].style.fill = "#9FBF3B80";
    }
  };

  const handleDelete = (id) => {
    if (id) {
      setDeleteModal(true)
    }
  }

  const onDelete = async (id) => {
    if (id) {
      await deleteRestaurantItem({ id })
        .then((data) => {
          if (data?.error?.data?.error?.message) {
            dispatch(
              showAlert({
                severity: SEVERITY.ERROR,
                text: data?.error?.data?.error?.message,
              })
            );
          } else {
            dispatch(
              showAlert({
                severity: SEVERITY.SUCCESS,
                text: "Restaurant item has been succesfully deleted!",
              })
            );
          }
        })
      setDeleteModal(false)

    }
  }

  return (
    <>
      <DeletModal
        open={deletemodal}
        toggleModal={setDeleteModal}
        modalDescription={`${`Do you want to delete ${name}? This process cannot ne undone.`}`}
        onDelete={() => onDelete(id)}
      />
      <Card className={`${styles["card"]}`} style={{ display: 'grid', gridTemplateRows: '1fr auto' }}>
        <CardHeader
          className="card-header"
          title={<Typography className="card-title">{name}</Typography>}
          subheader={
            <Typography className="card-sub-title">{restoAddress}</Typography>
          }
        />
        <CardContent>
          <List dense={true}>
            {Object.keys(menuBarItems).map((index) => {
              var menuBarItem = menuBarItems[index];
              return (
                <Link href={menuBarItem.link} key={index} passHref>
                  <ListItem
                    key={index}
                    className={`${styles["loc-item"]}`}
                    onClick={() => {
                      return handleClick(menuBarItem.title);
                    }}
                    onMouseEnter={() => {
                      setHoverStyles(id, index);
                    }}
                    onMouseLeave={() => {
                      unsetHoverStyles(id, index);
                    }}
                  >
                    <ListItemIcon className={`icon-spacing-${id}-${index}`}>
                      {menuBarItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={menuBarItem.title}
                      primaryTypographyProps={{ fontSize: "1rem" }}
                      className={`${styles["loc-item-text"]}`}
                    />
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </CardContent>
        {session?.role === "brand_manager" &&
          <>
            <Divider />
            <CardActions className={`${styles["card-action"]}`}>
              <Button
                variant="text"
                fullWidth
                style={{ color: "var(--red-900)" }}
                size="large"
                sx={{
                  fontSize: "18px",
                  fontWeight: 500,
                }}
                onClick={() => handleDelete(id)}
              >
                {DELETE_RESTAURANT}
              </Button>
            </CardActions>
          </>
        }
      </Card>
    </>
  );
});

export async function getServerSideProps(context) {
  const csrfToken = (await getCsrfToken(context)) || null;
  return requireAuthentication(context, ({ session }) => {
    return {
      props: { session, csrfToken },
    };
  });
}

export default LocationCard;
