import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { SEVERITY } from "../../../../../lib/constants";
import { useDeleteCategoryItemMutation } from "../../../../../pages/api/category/categoryApi";
import { showAlert } from "../../../../../store/slice/alertSlice";
import DeletModal from "../../../../DeletModal";
import styles from "./AvoCategoryCard.module.css";

const VIEW_CATEGORY = "View Category";
const DELETE_CATEGORY = "Delete Category";

const AvoCategoryCard = React.forwardRef(({ ...props }) => {
  const { id, name, items } = props;
  const dispatch = useDispatch();

  const [deletemodal, setDeleteModal] = React.useState(false);
  const [deleteCategoryItem] = useDeleteCategoryItemMutation();

  const handleDelete = (id) => {
    if (id) {
      setDeleteModal(true)
    }
  }

  const onDelete = async (id) => {
    if (id) {
      await deleteCategoryItem({ id })
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
                text: "Category item has been succesfully deleted!",
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
            {items.map((item, index) => {
              const { label, value } = item;
              return (
                <React.Fragment key={value}>
                  <ListItem className={`${styles["card-list-item"]}`}>
                    <Typography
                      sx={{
                        color: "#00000080",
                      }}
                      fontWeight="700"
                    >
                      {label}:
                      <Typography component="span" fontWeight="500">
                        {" "}
                        {value}
                      </Typography>
                    </Typography>
                  </ListItem>
                  {index < props.items.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
        <Divider />
        <CardActions className={`${styles["card-action"]}`}>
          <Link href={`category/${id}`} underline="none" passHref>
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
              {VIEW_CATEGORY}
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
            {DELETE_CATEGORY}
          </Button>
        </CardActions>
      </Card>
    </>
  );
});

export default AvoCategoryCard;
