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
import { useDispatch } from "react-redux";
import { SEVERITY } from "../../../../../lib/constants";
import { useDeleteFoodItemMutation } from "../../../../../pages/api/food-item/foodItemApi";
import { showAlert } from "../../../../../store/slice/alertSlice";
import DeletModal from "../../../../DeletModal";
import styles from "./AvoFoodItemCard.module.css";

const VIEW_ITEM = "View Item";
const DELETE_ITEM = "Delete Item";

const AvoFoodItemCard = React.forwardRef(({ ...props }) => {
  const { id, name, price, onClick } = props;
  const dispatch = useDispatch();

  const [deletemodal, setDeleteModal] = React.useState(false);
  const [deleteFoodItem] = useDeleteFoodItemMutation();

  const handleDelete = (id) => {
    if (id) {
      setDeleteModal(true)
    }
  }

  const onDelete = async (id) => {
    if (id) {
      await deleteFoodItem({ id })
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
                text: "Food item has been succesfully deleted!",
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
          avatar=""
          title={<Typography className="card-title">{name}</Typography>}
        />
        <CardContent className={`${styles["card-content"]}`}>
          <List>
            <ListItem className={`${styles["card-list-item"]}`}>
              <ListItemText primary={`Price: $${price}`} />
            </ListItem>
          </List>
        </CardContent>
        <Divider style={{ minHeight: "6rem" }} />
        <CardActions className={`${styles["card-action"]}`}>
          <Link href="#" underline="none" passHref>
            <Button
              variant="text"
              fullWidth
              style={{ color: "var(--green-900)" }}
              size="large"
              onClick={(e) => {
                e.preventDefault();
                onClick();
              }}
              sx={{
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              {VIEW_ITEM}
            </Button>
          </Link>
          <Button
            variant="text"
            fullWidth
            style={{ color: "var(--red-900)", borderLeft: "1px solid #dbdbdb", borderRadius: "0px" }}
            size="large"
            sx={{
              fontSize: "18px",
              fontWeight: 500,
            }}
            onClick={() => handleDelete(id)}
          >
            {DELETE_ITEM}
          </Button>
        </CardActions>
      </Card>
    </>
  );
});

export default AvoFoodItemCard;
