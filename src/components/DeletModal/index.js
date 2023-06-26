import {
  Button,
  Grid,
  IconButton,
  Modal,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SEVERITY, STRING } from "../../lib/constants";
import {
  useAddCategoryMutation
} from "../../pages/api/category/categoryApi";
import { showAlert } from "../../store/slice/alertSlice";
import CloseIcon from "../Icon/CloseIcon";

const addItemModalStyle = {
  width: "490px",
  top: "50%",
  position: "absolute",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "6px",
  boxShadow: 24,
  p: 4,
  paddingTop: "unset",
};

const DeletModal = ({
  open,
  modalDescription,
  // onCreateClick,
  toggleModal,
  onDelete
}) => {
  const [
    { isSuccess: isAddCategorySuccess, isLoading: isAddCategoryLoading },
  ] = useAddCategoryMutation();
  const dispatch = useDispatch();
  const [deleteList, setDeleteList] = useState(false)

  useEffect(() => {
    if (isAddCategorySuccess) {
      dispatch(
        showAlert({
          severity: SEVERITY.SUCCESS,
          text: "Category has been succesfully created!",
        })
      );
    }
    // eslint-why will cause unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddCategorySuccess]);

  return (
    <>
      <Modal open={open}>
        <Grid
          container
          sx={addItemModalStyle}
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <IconButton
              sx={{
                position: "absolute",
                right: "-50px",
                top: "-5px",
              }}
              onClick={() => {
                toggleModal(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography
              className="title"
              textAlign="left !important"
              fontSize="32px !important"
              sx={{
                marginTop: "30px !important",
                marginBottom: "38px !important",
              }}
            >
              Are You sure ?
            </Typography>
          </Grid>
          <Grid item className="mb-2">
            <Typography
              className="title"
              textAlign="left !important"
              fontSize="20px !important"
              sx={{
                marginTop: "30px !important",
                marginBottom: "38px !important",
                color: "#00000080 !important"
              }}
            >
              {modalDescription}
            </Typography>
          </Grid>
          <Grid
            item
            container
            direction="row"
            justifyContent="center"
            spacing={2}
          >
            <Grid item>
              <Button
                color="neutral"
                variant="contained"
                onClick={() => {
                  toggleModal(false);
                }}
                disabled={isAddCategoryLoading}
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: "18px",
                }}
              >
                {STRING.CANCEL}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => { onDelete(), setDeleteList(true) }}
                sx={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: "20px",
                  backgroundColor: "var(--red-900)",
                  ":hover": {
                    backgroundColor: "var(--red-900) !important"
                  }
                }}
                disabled={deleteList}
              >
                {STRING.DELETE}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Modal >
    </>
  );
};

export default DeletModal;
