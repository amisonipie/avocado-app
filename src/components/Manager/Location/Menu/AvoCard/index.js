import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import React from "react";
import styles from "./AvoCard.module.css";

const AvoCard = React.forwardRef(({ ...props }) => {
  return (
    <Card className={`${styles["card"]}`}>
      <CardHeader
        className="card-header"
        avatar={props.icon}
        title={
          <Typography className="card-title" fontSize="20px">
            {props.title}
          </Typography>
        }
      />
      <CardContent className={`${styles["card-content"]}`}>
        <List>
          {props.items &&
            Object.keys(props.items).map((index) => {
              var key = props.items[index]["key"];
              var value = props.items[index]["value"];
              return (
                <>
                  <ListItem className={`${styles["card-list-item"]}`}>
                    <ListItemText primary={key + ": " + value} />
                  </ListItem>
                  {index < props.items.length - 1 && <Divider />}
                </>
              );
            })}
        </List>
      </CardContent>
      <Divider />
      <CardActions className={`${styles["card-action"]}`}>
        <Link href={props.link.url} underline="none" passHref>
          <Button
            variant="text"
            fullWidth
            style={{ color: "var(--green-900)" }}
            size="large"
            sx={{
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            {props.link.text}
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
});

export default AvoCard;
