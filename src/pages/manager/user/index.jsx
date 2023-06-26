import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography
} from "@mui/material";

import React, { useEffect } from "react";
import ManagerLayout from "../../../components/Layout/Manager";

import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from '@mui/icons-material';
import { isEmpty } from "lodash";
import { getCsrfToken, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import styles from "../../../../styles/Modifiers.module.css";
import AvoBreadcrumbs from "../../../components/AvoBreadcrumbs";
import AvoTextField from "../../../components/Fields/AvoTextField";
import Password from "../../../components/Fields/Password";
import { UserFormSchema } from "../../../constants/ValidationSchema";
import { setupInterceptors } from "../../../interceptors/axiosinterceptor";
import { FIELD, SEVERITY, STRING } from "../../../lib/constants";
import { showAlert } from "../../../store/slice/alertSlice";
import { useAssignRoleMutation, useLazyGetDriverRolesUserQuery, useLazyGetRolesQuery, useLazyGetUserDetailsQuery, useRegisterDataMutation } from "../../api/user/userApi";
import { requireAuthentication } from "../../api/util/requireAuthentication";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const User = () => {
  const dispatch = useDispatch();
  const inputRef = React.useRef(null);
  const { data: session, status } = useSession();
  const [searchInput, setSearchInput] = React.useState({});
  const [dataList, setDataList] = React.useState();
  const [roleList, setRoleList] = React.useState();
  const [getDriverRoleListID, setgetDriverRoleListID] = React.useState();
  const [errorMsg, serErrorMsg] = React.useState("");
  const [showNewItemModal, setShowNewItemModal] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [imgBase64, setimgBase64] = React.useState("");
  const [image, setImage] = React.useState("/assets/images/upload-icon.png");
  const [imageView, setImageView] = React.useState("");
  const [currentEditingItem, setcurrentEditingItem] =
    React.useState("New User");

  const [getUserDetails, {
    data: usersData,
    isLoading,
    refetch: refetchUsers,
    error,
  }] = useLazyGetUserDetailsQuery();
  const [registerData] = useRegisterDataMutation();
  const [
    getRoles, { data: userDataList }
  ] = useLazyGetRolesQuery();

  const [
    getDriverRolesUser, { data: driverUserListData }
  ] = useLazyGetDriverRolesUserQuery();

  const [assignRole] = useAssignRoleMutation();

  useEffect(() => {
    getDriverRolesUser()
    getRoles()
  }, [])

  useEffect(() => {
    if (userDataList) {
      setRoleList(userDataList?.roles)
    }

    if (driverUserListData) {
      setgetDriverRoleListID(driverUserListData?.roles?.[0]?.id)
    }

    if (usersData) {
      setDataList(usersData?.users)
    }

    if (error) {
      serErrorMsg(error?.data?.error?.message)
    }

  }, [userDataList, driverUserListData, usersData, error])

  useEffect(() => {
    if (status === "authenticated") {
      setupInterceptors(session.accessToken);
      if (getDriverRoleListID) {
        getUserDetails({ roleId: getDriverRoleListID, emailId: "", firstName: "", page: page + 1, rowsPerPage: rowsPerPage });
      }
    }
    // eslint-why will cause unnecessary re renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDriverRoleListID, page, rowsPerPage]);


  const newItemBreadcrumbs = {
    items: [
      {
        text: STRING.USER,
        onClick: () => closeNewItemModal(),
      },
      {
        text: currentEditingItem,
      },
    ],
  };

  const openNewItemModal = () => {
    reset();
    setShowNewItemModal(true);
  };

  const closeNewItemModal = () => {
    setShowNewItemModal(false);
  };

  const columns = [
    { id: 'first_name', label: 'First Name' },
    { id: 'last_name', label: 'Last Name' },
    { id: 'email', label: 'Eamil' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'city', label: 'City' },
    { id: '', label: 'Action', minWidth: 100 }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields, isDirty },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(UserFormSchema),
    mode: "onChange",
  });

  const handleChange = (event) => {
    let Data = { ...searchInput, [event.target.name]: event.target.value };
    setSearchInput(Data)
    getUserDetails({
      roleId: getDriverRoleListID,
      emailId: Data?.email ? Data?.email : '',
      firstName: Data?.name ? Data?.name : '',
      page: '',
      rowsPerPage: rowsPerPage
    });
    if (event.target.value === "") {
      setDataList(usersData?.users)
    }
  };

  const handleOnImageChange = async (event) => {
    const [file] = event.target.files;
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageView(file)
    }
  };

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append('first_name', data?.first_name);
    formData.append('last_name', data?.last_name);
    formData.append('email', data?.email);
    formData.append('password', data?.password);
    formData.append('mobile', data?.mobile);
    formData.append('profile', imageView);
    await registerData(formData).then((res, err) => {
      if (res?.data?.user_id) {
        assignRole({ id: res?.data?.user_id, role_id: data?.role }).then((result, error) => {
          if (result?.error?.data?.error?.message) {
            dispatch(
              showAlert({
                severity: SEVERITY.ERROR,
                text: result?.error?.data?.error?.message,
              })
            );
          }

          if (result?.data) {
            dispatch(
              showAlert({
                severity: SEVERITY.SUCCESS,
                text: 'User has been succesfully created!',
              })
            );
            reset(
              {},
              {
                keepValues: true,
              }
            );
            setImage('/assets/images/upload-icon.png');
            setShowNewItemModal(false);
            getUserDetails({ roleId: getDriverRoleListID, emailId: '', firstName: '', page: page + 1, rowsPerPage: rowsPerPage });
          }
        })
      }
      if (res?.error?.data?.error?.message) {
        dispatch(
          showAlert({
            severity: SEVERITY.ERROR,
            text: res?.error?.data?.error?.message,
          })
        );
      }
    }).catch((err) => console.log("err", err));

  }

  return (
    <ManagerLayout enableMenuBar={true} isLoading={isLoading}>
      <Dialog
        fullScreen
        open={showNewItemModal}
        onClose={closeNewItemModal}
        TransitionComponent={Transition}
      >
        <AppBar className={`${styles["dialog-appbar"]}`} elevation={0}>
          <Toolbar>
            <Grid item container direction="row" justifyContent="space-between">
              <Grid item>
                <AvoBreadcrumbs {...newItemBreadcrumbs} />
              </Grid>

              <Grid item>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={closeNewItemModal}
                      color="neutral"
                      sx={{
                        color: "black",
                        fontWeight: 500,
                      }}
                    >
                      {STRING.CANCEL}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      form="modifier-group"
                      sx={{
                        color: "black",
                        fontWeight: 500,
                      }}
                      disabled={
                        (isEmpty(imgBase64) || !isEmpty(errors)) &&
                        !isDirty
                      }
                      onClick={handleSubmit(onSubmit)}
                    >
                      {STRING.SAVE}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Toolbar></Toolbar>

        <DialogContent dividers className={`${styles["dialog-content"]} ${styles["dialog-content-center"]}`}>
          <form
            id="restaurant-detail-form"
          >
            <Grid container direction="column">
              <Grid item>
                <Card style={{ width: "var(--6xl-card)" }}>
                  <CardHeader
                    className="card-header"
                    title={
                      <Typography
                        className="card-title"
                        textAlign="left !important"
                      >
                        User Information
                      </Typography>
                    }
                  />
                  <CardContent className={`${styles["card-content-center"]}`}>
                    <Grid container direction="row" style={{ flexWrap: "nowrap", display: "flex", justifyContent: "space-around" }}>
                      <Grid item className={`${styles["card-1"]}`}>
                        <Grid container direction="column" spacing={2}>
                          <Grid
                            container
                            item
                            display="grid"
                            gridTemplateColumns="2fr 1fr"
                          >
                            <Grid item>
                              <Typography
                                className={`${styles["banner-title"]} mb-1`}
                              >
                                {FIELD.PROFILE_IMAGE.LABEL}
                              </Typography>
                              <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={(e) => {
                                  return handleOnImageChange(e);
                                }}
                              />
                              <label htmlFor="raised-button-file">
                                <Image
                                  src={image || "/assets/images/upload-icon.png"}
                                  className={`${styles["upload-icon"]}`}
                                  alt="uploaded-image"
                                  width={250}
                                  height={150}
                                />
                              </label>
                            </Grid>
                            <Grid item>
                              <Typography
                                sx={{
                                  marginTop: "35px",
                                  fontSize: "15px",
                                }}
                              >
                                This image should be 1029 px wide by 516 px tall.
                              </Typography>
                              {image !== null && (
                                <>
                                  <input
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    type="file"
                                    ref={inputRef}
                                    onChange={(e) => {
                                      return handleOnImageChange(e);
                                    }}
                                  />
                                  <Button
                                    variant="text"
                                    sx={{
                                      paddingLeft: "0px",
                                      float: "left",
                                    }}
                                    onClick={() => {
                                      return inputRef.current.click();
                                    }}
                                  >
                                    Change
                                  </Button>
                                </>
                              )}
                            </Grid>
                          </Grid>

                          <Grid item>
                            <AvoTextField
                              fullWidth
                              variant="outlined"
                              error={Boolean(errors.first_name)}
                              helperText={errors.first_name && errors.first_name.message}
                              {...register("first_name")}
                              label={FIELD.FIRST_NAME.LABEL}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item>
                            <AvoTextField
                              fullWidth
                              variant="outlined"
                              error={Boolean(errors.last_name)}
                              helperText={errors.last_name && errors.last_name.message}
                              {...register("last_name")}
                              label={FIELD.LAST_NAME.LABEL}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item>
                            <AvoTextField
                              fullWidth
                              variant="outlined"
                              error={Boolean(errors.email)}
                              helperText={errors.email && errors.email.message}
                              {...register(FIELD.EMAIL.UNIQUE_NAME)}
                              label={FIELD.EMAIL.LABEL}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                        </Grid>
                      </Grid>

                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        style={{ margin: "0rem 2rem" }}
                      />

                      <Grid item className={`${styles["card-2"]}`}>
                        <Grid container direction="column" spacing={2}>
                          <Grid item>
                            <Password
                              {...register("password")}
                              error={Boolean(errors.password)}
                              helperText={
                                errors.password && errors.password.message
                              }
                              label="Password"
                              placeholder="Enter your password"
                              margin="none"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item>
                            <Password
                              {...register("confirmPassword")}
                              error={Boolean(errors.confirmPassword)}
                              helperText={
                                errors.confirmPassword && errors.confirmPassword.message
                              }
                              label="Confrim Password"
                              placeholder="Enter your confrim password"
                              margin="none"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <AvoTextField
                              fullWidth
                              variant="outlined"
                              error={Boolean(errors.mobile)}
                              helperText={errors.mobile && errors.mobile.message}
                              {...register("mobile")}
                              label="Mobile Number"
                              name="mobile"
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
                                      error={value === undefined && Boolean(errors.role)}
                                      helperText={value === undefined && errors.role && errors?.role?.message}
                                      {...register("role")}
                                      name={name}
                                      label="Role"
                                      onChange={(event) => {
                                        onChange(event.target.value);
                                      }}
                                      value={value}
                                    >
                                      {roleList?.map((option) => {
                                        return (
                                          option.type === "driver" &&
                                          <MenuItem key={option.id} value={option.id}>
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
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <Grid container direction="column">
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          className="header-top"
        >
          <Grid item>
            <Typography
              className="title"
              textAlign="left !important"
              fontSize="48px !important"
              marginTop="15px !important"
            >
              Users
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={openNewItemModal}
              sx={{
                color: "black",
              }}
            >
              {STRING.ADD_USER}
            </Button>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            paddingTop: "50px",
            paddingBottom: "50px",
            paddingRight: "25px",
            paddingLeft: "50px",
          }}
        >
          <Grid container direction="column">
            <Grid
              item
              container
              direction="row"
              justifyContent="flex-start"
              spacing={2}
              className="header-top"
            >
              <Grid item className="mb-2" sx={{ width: "20%" }}>
                <AvoTextField
                  fullWidth
                  variant="outlined"
                  label="Search by Email"
                  name="email"
                  value={searchInput?.email || ''}
                  onChange={(e) => {
                    handleChange(e)
                  }}
                />

              </Grid>
              <Grid item className="mb-2" sx={{ width: "20%" }}>
                <AvoTextField
                  fullWidth
                  variant="outlined"
                  label="Search by First Name"
                  name="name"
                  value={searchInput?.name || ''}
                  onChange={(e) => {
                    handleChange(e)
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              {/* <TableHead> */}
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, color: "#000", fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              {/* </TableHead> */}
              <TableBody>
                {dataList?.length > 0 ?
                  dataList?.map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row?.id}>
                        <TableCell>{row?.first_name}</TableCell>
                        <TableCell>{row?.last_name}</TableCell>
                        <TableCell>{row?.email}</TableCell>
                        <TableCell>{row?.mobile === null ? "-" : row?.mobile}</TableCell>
                        <TableCell>{row?.city === null ? "-" : row?.city}</TableCell>
                        <TableCell>
                          <Link href={`singleUser/${row?.id}`} underline="none" passHref>
                            <IconButton>
                              <Edit />
                            </IconButton>
                          </Link>
                          {/* <IconButton onClick={() => handleDelete(row?.id)}>
                              <Delete />
                            </IconButton> */}
                        </TableCell>
                      </TableRow>
                    );
                  })
                  :
                  <TableRow> <TableCell colSpan={5} style={{ textAlign: "center", borderBottom: 'none' }}>{errorMsg ? errorMsg : 'No Records Found!'}</TableCell> </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={usersData?.pagination?.records?.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid >
    </ManagerLayout >
  );
};

export async function getServerSideProps(context) {
  const csrfToken = (await getCsrfToken(context)) || null;
  return requireAuthentication(context, ({ session }) => {
    return {
      props: { session, csrfToken },
    };
  });
}

export default User;
