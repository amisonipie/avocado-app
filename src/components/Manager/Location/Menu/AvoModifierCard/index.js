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
import React from "react";
import { useDispatch } from "react-redux";
import { SEVERITY } from "../../../../../lib/constants";
import { useDeleteModifierMutation } from "../../../../../pages/api/modifier/modifierApi";
import { showAlert } from "../../../../../store/slice/alertSlice";
import DeletModal from "../../../../DeletModal";
import styles from "./AvoModifierCard.module.css";

const VIEW_MOD_GROUP = "View Mod Group";
const DELETE_MOD_GROUP = "Delete Mod Group";

const AvoModifierCard = React.forwardRef(({ ...props }) => {
  const { id, items, onClick } = props;
  const dispatch = useDispatch();
  const [deletemodal, setDeleteModal] = React.useState(false);
  const [deleteModifier] = useDeleteModifierMutation();

  const handleDelete = (id) => {
    if (id) {
      setDeleteModal(true)
    }
  }

  const onDelete = async (id) => {
    if (id) {
      await deleteModifier({ id })
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
                text: "Modifier item has been succesfully deleted!",
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
        modalDescription={`${`Do you want to delete this record? This process cannot ne undone.`}`}
        onDelete={() => onDelete(id)}
      />
      <Card className={`${styles["card"]}`} style={{ display: 'grid', gridTemplateRows: '1fr auto' }}>
        <CardHeader
          className="card-header"
          avatar=""
          title={<Typography className="card-title">{props.name}</Typography>}
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
              fontSize: "17px",
              fontWeight: 500,
            }}
          >
            {VIEW_MOD_GROUP}
          </Button>
          <Button
            variant="text"
            fullWidth
            style={{ color: "var(--red-900)", borderLeft: "1px solid #dbdbdb", borderRadius: "0px" }}
            size="large"
            sx={{
              fontSize: "17px",
              fontWeight: 500,
            }}
            onClick={() => handleDelete(id)}
          >
            {DELETE_MOD_GROUP}
          </Button>
        </CardActions>
      </Card>
    </>
  );
});

export default AvoModifierCard;
