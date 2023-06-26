import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { STRING } from "../../../../../lib/constants";
import ModifiersIcon from "../../../../Icon/ModifiersIcon";
import styles from "./ModifierCard.module.css";

const CardContentNoPadding = styled(CardContent)(`
    padding: 0;
    &:last-child {
      paddingBottom: 0;
    }
`);

const ModifierCard = React.forwardRef(({ ...props }, ref) => {
  return (
    <Card className={`${styles["card"]}`}>
      <CardHeader
        avatar={<ModifiersIcon />}
        title={
          <Typography className={`${styles["card-title"]}`}>
            {STRING.MODIFIERS}
          </Typography>
        }
      />
      <CardContentNoPadding>
        <List className={`${styles["list-space"]}`}>
          <ListItem disablePadding>
            <ListItemText primary="Categories: 10" />
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemText primary="Last Edited: Yesterday" />
          </ListItem>
        </List>
        <Divider />
        <CardActions className={`${styles["card-action"]}`}>
          <Typography
            className={`${styles["card-action-title"]}`}
            variant="button"
            display="block"
            gutterBottom
          >
            {STRING.VIEW_MODIFIERS}
          </Typography>
        </CardActions>
      </CardContentNoPadding>
    </Card>
  );
});

export default ModifierCard;
