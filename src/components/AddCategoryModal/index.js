import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FIELD, SEVERITY, STRING } from "../../lib/constants";
import {
  useAddCategoryMutation,
  useGetCategoryListQuery,
} from "../../pages/api/category/categoryApi";
import { showAlert } from "../../store/slice/alertSlice";
import AvoTextField from "../Fields/AvoTextField";
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

const AddCategoryModal = ({
  open,
  modalTitle,
  // onCreateClick,
  toggleModal,
  restaurantId,
  // setCategoryName,
}) => {
  const [
    addCategory,
    { isSuccess: isAddCategorySuccess, isLoading: isAddCategoryLoading },
  ] = useAddCategoryMutation();
  const dispatch = useDispatch();

  const { refetch } = useGetCategoryListQuery({ restaurantId });
  const [categoryName, setCategoryName] = useState("");

  const handleCreateCategory = async () => {
    const request = {
      name: categoryName,
      restaurant_id: restaurantId,
    };
    await addCategory(request);
    toggleModal(false);
  };

  useEffect(() => {
    if (isAddCategorySuccess) {
      refetch();
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
              disabled={isAddCategoryLoading}
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
              {modalTitle}
            </Typography>
          </Grid>
          <Grid item className="mb-2">
            <AvoTextField
              fullWidth
              variant="outlined"
              label={FIELD.NEW_CATEGORY.LABEL}
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
            />
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
                  color: "black",
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
                onClick={handleCreateCategory}
                sx={{
                  color: "black",
                  fontWeight: 500,
                  fontSize: "18px",
                }}
                disabled={isEmpty(categoryName)}
              >
                {isAddCategoryLoading && (
                  <CircularProgress
                    size={20}
                    thickness={5}
                    sx={{ marginRight: "5px" }}
                  />
                )}
                {STRING.CREATE}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};

export default AddCategoryModal;
