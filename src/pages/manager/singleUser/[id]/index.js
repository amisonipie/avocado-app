import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Slide,
  Toolbar,
  Typography
} from "@mui/material";
import { isEmpty, isNil } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import styles from "../../../../../styles/Modifiers.module.css";
import AvoBreadcrumbs from "../../../../components/AvoBreadcrumbs";
import AvoTextField from "../../../../components/Fields/AvoTextField";
import ManagerLayout from "../../../../components/Layout/Manager";
import { setupInterceptors } from "../../../../interceptors/axiosinterceptor";
import {
  APP_URL,
  FIELD,
  LINKS,
  SEVERITY,
  STRING
} from "../../../../lib/constants";
import { showAlert } from "../../../../store/slice/alertSlice";
import { useLazyGetSingleUserListQuery, useUpdateSingleUserListMutation } from "../../../api/user/userApi";
import { requireAuthentication } from "../../../api/util/requireAuthentication";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const addItemModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

export const SingleUser = (props) => {
  useEffect(() => {
    const { accessToken } = props.session;
    if (accessToken) {
      setupInterceptors(accessToken);
    }
  }, [props]);
  const router = useRouter();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const [userItems, setUserItems] = useState([]);
  const [imgBase64, setimgBase64] = React.useState("");
  const userId = router.query.id;
  const [showNewItemModal, setShowNewItemModal] = React.useState(true);
  const [image, setImage] = React.useState("/assets/images/upload-icon.png");
  const [imageView, setImageView] = React.useState("");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    formState: { errors, isDirty },
    watch,
  } = useForm({ mode: "onChange", });

  const [getSingleUserList, {
    data: userItemList,
    isLoading: isGetFoodItemByCategoryLoading,
    refetch: refetchUsers,
  }] = useLazyGetSingleUserListQuery();

  const [updateSingleUserList] = useUpdateSingleUserListMutation();

  useEffect(() => {
    if (userId) {
      getSingleUserList({ id: userId })
    }
  }, [userId])

  useEffect(() => {
    if (userItemList?.users) {
      setUserItems(userItemList?.users);
    }
  }, [userItemList]);

  const setDefaultImageFromApi = () => {
    // set image/banner if media property is not null
    if (!isNil(userItems?.media?.profile?.url)) {
      const bannerImage = `${APP_URL}${userItems?.media?.profile?.url}`;
      setImage(bannerImage);
    }
  };

  const handleOnImageChange = async (event) => {
    const [file] = event.target.files;
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageView(file)
    }
  };

  useEffect(() => {
    // Set default values
    if (userItems) {
      const {
        first_name,
        last_name,
        email,
        mobile,
      } = userItems;

      const data = {
        first_name,
        last_name,
        email,
        mobile,
      };

      setDefaultImageFromApi();
      reset(data);
      // eslint-why will cause unnecessary re renders
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userItems, reset, setValue]);

  const newItemBreadcrumbs = {
    items: [
      {
        text: STRING.USER,
        onClick: async (e) => {
          e.preventDefault(),
            await router.push(LINKS.USERS),
            closeNewItemModal()
        }
      },
      {
        text: userItems?.first_name,
      },
    ],
  };

  const closeNewItemModal = (e) => {
    setShowNewItemModal(false);
  };

  const dirtyValues = (dirtyFields, allValues) => {
    // If *any* item in an array was modified, the entire array must be submitted, because there's no
    // way to indicate "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
    if (dirtyFields === true || Array.isArray(dirtyFields)) {
      return allValues;
    }

    // Here, we have an object.
    return Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        dirtyValues(dirtyFields[key], allValues[key]),
      ])
    );
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await updateSingleUserList({
      id: userId,
      first_name: data?.first_name,
      last_name: data?.last_name,
      profile: imageView,
      email: data?.email,
      mobile: data?.mobile
    }).then((result) => {
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
            text: 'User has been succesfully edited!',
          })
        );
      }
    })
    setShowNewItemModal(false);
    router.push(LINKS.USERS)

  };

  return (
    <ManagerLayout enableMenuBar={true} isLoading={isGetFoodItemByCategoryLoading}>
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
                      onClick={() => { closeNewItemModal(), router.push(LINKS.USERS) }}
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
          <form id="hook-form">
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

                          <Grid item>
                            <AvoTextField
                              fullWidth
                              variant="outlined"
                              error={Boolean(errors.mobile)}
                              helperText={errors.mobile && errors.mobile.message}
                              {...register("mobile")}
                              label="Mobile Number"
                              InputLabelProps={{ shrink: true }}
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
    </ManagerLayout>
  );
};

export async function getServerSideProps(context) {
  return requireAuthentication(context, ({ session }) => {
    return {
      props: { session },
    };
  });
}

export default SingleUser;
