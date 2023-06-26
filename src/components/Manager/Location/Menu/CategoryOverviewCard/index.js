import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { STRING } from "../../../../../lib/constants";
import styles from "./CategoryOverviewCard.module.css";

const categoreyOverviewMenuList = [
  {
    item: "10",
    position: "1-First",
    edited: "Yesterday",
  },
];

const CardContentNoPadding = styled(CardContent)(`
    padding: 0;
    &:last-child {
      paddingBottom: 0;
    }
`);

const CategoryOverviewCard = React.forwardRef(
  ({ type, placeholder, ...props }, ref) => {
    return (
      <Grid item>
        <Card className={`${styles["card"]}`}>
          <CardHeader
            title={
              <Typography className={`${styles["cat-card-title"]}`}>
                {props.title}
              </Typography>
            }
          />
          <CardContentNoPadding>
            <List
              dense={false}
              className={`${styles["cat-list-space"]}`}
              disableGutters
            >
              {Object.keys(categoreyOverviewMenuList).map((index) => {
                var categoreyOverviewMenu = categoreyOverviewMenuList[index];
                return (
                  <ListItem
                    key={index}
                    className={`${styles["cat-list-item"]}`}
                    disablePadding
                  >
                    <ListItemText
                      primary="Items : "
                      secondary={categoreyOverviewMenu.item}
                      primaryTypographyProps={{ fontSize: "1rem" }}
                      className={`${styles["cat-list-item-text"]}`}
                    />
                  </ListItem>
                );
              })}

              <Divider />
              {Object.keys(categoreyOverviewMenuList).map((index) => {
                var categoreyOverviewMenu = categoreyOverviewMenuList[index];
                return (
                  <ListItem
                    key={index}
                    className={`${styles["cat-list-item"]}`}
                    disablePadding
                  >
                    <ListItemText
                      primary="Position in App : "
                      secondary={categoreyOverviewMenu.position}
                      primaryTypographyProps={{ fontSize: "1rem" }}
                      className={`${styles["cat-list-item-text"]}`}
                    />
                  </ListItem>
                );
              })}

              <Divider />
              {Object.keys(categoreyOverviewMenuList).map((index) => {
                var categoreyOverviewMenu = categoreyOverviewMenuList[index];
                return (
                  <ListItem
                    key={index}
                    className={`${styles["cat-list-item"]}`}
                    disablePadding
                  >
                    <ListItemText
                      primary="Last Edited : "
                      secondary={categoreyOverviewMenu.edited}
                      primaryTypographyProps={{ fontSize: "1rem" }}
                      className={`${styles["cat-list-item-text"]}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </CardContentNoPadding>
          <Divider />
          <CardActions className={`${styles["cat-card-action"]}`}>
            <Typography
              className={`${styles["cat-card-action-title"]}`}
              variant="button"
              display="block"
              gutterBottom
            >
              {STRING.VIEW_CATEGORIES}
            </Typography>
          </CardActions>
        </Card>
      </Grid>
    );
  }
);

export default CategoryOverviewCard;
