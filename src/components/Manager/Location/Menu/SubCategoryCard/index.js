import styled from "@emotion/styled";
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
import React from "react";
import { STRING } from "../../../../../lib/constants";
import styles from "./SubCategory.module.css";
const subcategoryList = [
  {
    price: "$10.00",
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

const SubCategoryCard = React.forwardRef(
  ({ type, placeholder, ...props }, ref) => {
    return (
      <Grid item>
        <Card className={`${styles["card"]}`}>
          <CardHeader
            title={
              <Typography className={`${styles["card-title"]}`}>
                {props.title}
              </Typography>
            }
          />
          <CardContentNoPadding>
            <List
              dense={false}
              className={`${styles["list-space"]}`}
              disableGutters
            >
              {Object.keys(subcategoryList).map((index) => {
                var subcategory = subcategoryList[index];
                return (
                  <ListItem
                    key={index}
                    className={`${styles["card-item"]}`}
                    disablePadding
                  >
                    <ListItemText
                      primary="Position in App : "
                      secondary={subcategory.position}
                      primaryTypographyProps={{ fontSize: "1rem" }}
                      className={`${styles["card-item-text"]}`}
                    />
                  </ListItem>
                );
              })}

              <Divider />
              {Object.keys(subcategoryList).map((index) => {
                var subcategory = subcategoryList[index];
                return (
                  <ListItem
                    key={index}
                    className={`${styles["card-item"]}`}
                    disablePadding
                  >
                    <ListItemText
                      primary="Items : "
                      secondary={subcategory.price}
                      primaryTypographyProps={{ fontSize: "1rem" }}
                      className={`${styles["card-item-text"]}`}
                    />
                  </ListItem>
                );
              })}

              <Divider />
              {Object.keys(subcategoryList).map((index) => {
                var subcategory = subcategoryList[index];
                return (
                  <ListItem
                    key={index}
                    className={`${styles["card-item"]}`}
                    disablePadding
                  >
                    <ListItemText
                      primary="Last Edited : "
                      secondary={subcategory.edited}
                      primaryTypographyProps={{ fontSize: "1rem" }}
                      className={`${styles["card-item-text"]}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </CardContentNoPadding>
          <Divider />
          <CardActions className={`${styles["card-action"]}`}>
            <Typography
              className={`${styles["card-action-title"]}`}
              variant="button"
              display="block"
              gutterBottom
            >
              {STRING.VIEW_ITEM}
            </Typography>
          </CardActions>
        </Card>
      </Grid>
    );
  }
);

export default SubCategoryCard;
