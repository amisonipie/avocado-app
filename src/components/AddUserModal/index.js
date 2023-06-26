import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { FIELD, SEVERITY, STRING } from "../../lib/constants";
import {
  useAddCategoryMutation
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

const modifierItemOptions = [
  { id: 1, name: "Regional", value: "regional" },
  { id: 2, name: "Location Manager", value: "location manager" },
  { id: 3, name: "Driver", value: "driver" }
]
const AddUserModal = ({
  open,
  modalTitle,
  // onCreateClick,
  toggleModal,
  // restaurantId,
  // setUserList,
}) => {
  const [
    addCategory,
    { isSuccess: isAddCategorySuccess, isLoading: isAddCategoryLoading },
  ] = useAddCategoryMutation();
  const dispatch = useDispatch();

  // const { refetch } = useGetCategoryListQuery({ restaurantId });
  const [userList, setUserList] = useState({});

  // const handleChange = (event) => {
  //   setUserList({ ...userList, [event.target.name]: event.target.value })
  // }

  // const handleCreateCategory = async () => {
  //   const request = {
  //     name: userList,
  //     restaurant_id: restaurantId,
  //   };
  //   await addCategory(request);
  //   toggleModal(false);
  // };

  useEffect(() => {
    if (isAddCategorySuccess) {
      // refetch();
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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    toggleModal(false);
  }

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
              {...register(FIELD.FIRST_NAME.UNIQUE_NAME)}
              label={FIELD.FIRST_NAME.LABEL}
              name={FIELD.FIRST_NAME.UNIQUE_NAME}
            // value={userList?.firstName}
            // onChange={(e) => {
            //   handleChange(e)
            // }}
            />
          </Grid>
          <Grid item className="mb-2">
            <AvoTextField
              fullWidth
              variant="outlined"
              {...register(FIELD.LAST_NAME.UNIQUE_NAME)}
              label={FIELD.LAST_NAME.LABEL}
              name={FIELD.LAST_NAME.UNIQUE_NAME}
            // value={userList?.lastName}
            // onChange={(e) => {
            //   handleChange(e)
            // }}
            />
          </Grid>
          <Grid item className="mb-2">
            <AvoTextField
              fullWidth
              variant="outlined"
              {...register(FIELD.EMAIL.UNIQUE_NAME)}
              label={FIELD.EMAIL.LABEL}
              name={FIELD.EMAIL.UNIQUE_NAME}
            // value={userList?.email}
            // onChange={(e) => {
            //   handleChange(e)
            // }}
            />
          </Grid>
          <Grid item className="mb-2">
            <Controller
              name="role"
              control={control}
              render={({ field: { onChange, value, name } }) => {
                return (
                  <FormControl sx={{ width: 420 }}>
                    <InputLabel id="demo-select-small">
                      Role
                    </InputLabel>
                    <Select
                      name={name}
                      label="Role"
                      onChange={(event) => {
                        onChange(event.target.value);
                        setUserList(event.target.value)
                      }}
                      value={value}
                    >
                      {modifierItemOptions?.map((option) => {
                        return (
                          <MenuItem key={option.id} value={option.value}>
                            {option.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                );
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
                  setUserList({})
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
                onClick={handleSubmit(onSubmit)}
                sx={{
                  color: "black",
                  fontWeight: 500,
                  fontSize: "18px",
                }}
                disabled={isEmpty(userList)}
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

export default AddUserModal;
