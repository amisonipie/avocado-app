import { yupResolver } from "@hookform/resolvers/yup";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { AppBar, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogContent, Divider, FormControl, FormControlLabel, Grid, InputAdornment, MenuItem, Select, Slide, TextField, Toolbar, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { getCsrfToken, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import styles from "../../../../styles/Modifiers.module.css";
import AvoBreadcrumbs from "../../../components/AvoBreadcrumbs";
import AvoGoogleAutocomplete from "../../../components/AvoGoogleAutocomplete";
import AvoTextField from "../../../components/Fields/AvoTextField";
import Password from "../../../components/Fields/Password";
import ManagerLayout from "../../../components/Layout/Manager";
import LocationCard from "../../../components/Manager/Location/LocationCard";
import AvoSwitch from "../../../components/Switch";
import { RestaurantFormSchema } from "../../../constants/ValidationSchema";
import { setupInterceptors } from "../../../interceptors/axiosinterceptor";
import { FIELD, SEVERITY, STRING } from "../../../lib/constants";
import { showAlert } from "../../../store/slice/alertSlice";
import { useAddAddressMutation } from "../../api/address/addressApi";
import { useAddRestaurantDetailMutation, useLazyGetBrandListQuery, useLazyGetRestaurantListQuery } from "../../api/restaurant/restaurantApi";
import { requireAuthentication } from "../../api/util/requireAuthentication";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Location = (props) => {
  const [getRestaurantList, { data: restaurantData, isLoading }] =
    useLazyGetRestaurantListQuery();
  const [addRestaurantDetail] = useAddRestaurantDetailMutation();
  const [getBrandList, { data: brandData, error: brand_error }] = useLazyGetBrandListQuery()
  const inputRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch()
  const { data: session, status } = useSession();
  const [restaurants, setrestaurants] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [brandList, setBrandList] = useState([]);
  const [isLocationAddressFieldDirty, setIsLocationAddressFieldDirty] =
    useState(false);
  const [showNewItemModal, setShowNewItemModal] = React.useState(false);
  const [currentEditingItem, setcurrentEditingItem] =
    useState("New Restaurant");
  const [image, setImage] = useState("/assets/images/upload-icon.png");
  const [imageView, setImageView] = useState("");
  const [chips, setChips] = useState([]);
  const [isAddressFieldHasvalue, setisAddressFieldHasvalue] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setupInterceptors(session.accessToken);
      getRestaurantList();
      session?.role === "brand_manager" && getBrandList();
    }
    // eslint-why will cause unnecessary re renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (restaurantData) {
      const { restaurants: allRestaurants } = restaurantData;
      setBrandName(allRestaurants[0].brand.name);
      setrestaurants(allRestaurants);
    }

    if (brandData) {
      setBrandList(brandData?.brands)
    }

    if (brand_error) {
      dispatch(
        showAlert({
          severity: SEVERITY.ERROR,
          text: brand_error?.data?.error?.message || brand_error?.data?.message,
        })
      );
    }
  }, [restaurantData, brandData, brand_error]);


  const [
    addAddress,
    {
      isSuccess: isUpdateAddressSuccess,
      isLoading: isUpdateAddressLoading,
      error: updateRestaurantAddressError,
    },
  ] = useAddAddressMutation();


  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields, isDirty },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(RestaurantFormSchema),
  });
  const watchChips = watch("chips");
  // {
  //   mode: "onChange",
  //   resolver: yupResolver(RestaurantFormSchema),
  // }
  const newItemBreadcrumbs = {
    items: [
      {
        text: STRING.RESTAURANT,
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
    setChips([])
    setImage("/assets/images/upload-icon.png")
  };

  const handleOnImageChange = async (event) => {
    const [file] = event.target.files;
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageView(file)
    }
  };

  const dirtyValues = (dirtyFields, allValues) => {
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

  useEffect(() => {
  }, [updateRestaurantAddressError, isUpdateAddressSuccess])

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { address, ...request } = data;
    // const apiRequest = dirtyValues(dirtyFields, data);
    const isAddressFieldDirty =
      (!isEmpty(address) &&
        !isEmpty(address.details) &&
        !isEmpty(address.contact_no));

    const ValueForm = new FormData();
    imageView && ValueForm.append('banner', imageView);
    ValueForm.append('name', data?.name);
    ValueForm.append('description', data?.description);
    chips?.length > 0 ? ValueForm.append('tags', chips) : '';
    ValueForm.append('tip_out', data?.tip_out);
    ValueForm.append('tax', data?.tax);
    ValueForm.append('delivery_fees_type', data?.delivery_fees_type);
    ValueForm.append('delivery_fees', data?.delivery_fees);
    ValueForm.append('prep_time', data?.prep_time);
    ValueForm.append('service_radius', data?.service_radius);
    ValueForm.append('secret_pin', data?.secret_pin);
    ValueForm.append('secret_key', data?.secret_key);
    ValueForm.append('opening_time', data?.opening_time);
    ValueForm.append('closing_time', data?.closing_time);
    ValueForm.append('pos', (data?.pos === undefined || data?.pos === true) ? 1 : 0);
    ValueForm.append('pickup', data?.pickup === true ? 1 : 0);
    ValueForm.append('delivery', data?.delivery === true ? 1 : 0);
    ValueForm.append('brand_id', brandList[0]?.id);
    data?.address?.contact_no && ValueForm.append('contact_no', JSON.stringify(address.contact_no));
    data?.address?.details && ValueForm.append('address', JSON.stringify(address?.details));

    try {
      const result = await addRestaurantDetail(ValueForm);
      if (result?.error?.data?.error?.message) {
        dispatch(
          showAlert({
            severity: SEVERITY.ERROR,
            text: result.error.data.error.message,
          })
        );
      }
      if (result?.error?.data?.result?.data || result?.error?.data?.result?.data?.success) {
        dispatch(
          showAlert({
            severity: SEVERITY.ERROR,
            text: result.error.data.result.data || "Please check your fields!",
          })
        );
      }
      if (result?.data) {
        const { contact_no, details } = address;
        const apiRequestAddress = { model_id: result.data.restaurant_id, type: "restaurant", is_default: 1, contact_no, ...details };
        try {
          const res = await addAddress(apiRequestAddress);
          dispatch(
            showAlert({
              severity: SEVERITY.SUCCESS,
              text: 'Restaurant has been successfully created!',
            })
          );
          reset({}, { keepValues: true });
          setImage('/assets/images/upload-icon.png');
          setChips([]);
          setShowNewItemModal(false);
          setIsLocationAddressFieldDirty(false);
        } catch (error) {
          dispatch(
            showAlert({
              severity: SEVERITY.ERROR,
              text: 'Please choose a proper location address',
            })
          );
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }


  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const chipValue = e.target.value.trim();
      e.target.value = "";
      if (chipValue && !chips.includes(chipValue)) {
        setChips([...chips, chipValue]);
        setValue("chips", "");
      }
      if (watchChips) {
        e.target.placeholder = "";
      }
    }
  };

  const handleDeleteChip = (index) => {
    setChips(chips.filter((_, i) => i !== index));
    setValue(
      "tags",
      chips.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };

  return (
    <ManagerLayout enableMenuBar={false} isLoading={isLoading}>
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
          // onSubmit=
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
                        Basic Information
                      </Typography>
                    }
                  />
                  <CardContent className={`${styles["card-content-center"]}`}>
                    <Grid container direction="row" style={{ flexWrap: "nowrap" }}>
                      <Grid item className={`${styles["card-1"]}`}>
                        <Grid container direction="column" spacing={2}>
                          <Grid item>
                            <AvoTextField
                              {...register("name")}
                              id={FIELD.RESTAURANT_NAME.UNIQUE_NAME}
                              label={FIELD.RESTAURANT_NAME.LABEL}
                              placeholder={FIELD.RESTAURANT_NAME.PLACEHOLDER}
                              error={Boolean(errors.name)}
                              helperText={errors.name && errors.name.message}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item>
                            <AvoTextField
                              {...register("description")}
                              id={FIELD.RESTAURANT_DESC.UNIQUE_NAME}
                              label={FIELD.LOCATION_DESC.LABEL}
                              placeholder={FIELD.LOCATION_DESC.PLACEHOLDER}
                              error={Boolean(errors.description)}
                              helperText={errors.description && errors.description.message}
                              fullWidth
                              multiline
                              rows={5}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item>
                            <Controller
                              name="chips"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Tags"
                                  placeholder={
                                    chips.length > 0 ? "" : "e.g., tag1, tag2, tag3"
                                  }
                                  fullWidth
                                  onKeyDown={handleKeyDown}
                                  InputProps={{
                                    startAdornment: chips.map((chip, index) => (
                                      <Chip
                                        key={index}
                                        label={chip}
                                        onDelete={() => handleDeleteChip(index)}
                                      />
                                    )),
                                  }}
                                  inputRef={field.ref}
                                />
                              )}
                            />
                          </Grid>

                          <Grid item>
                            <AvoGoogleAutocomplete
                              // defaultFormattedAddress={formattedDefaultAddress}
                              setAvoFormValue={setValue}
                              setisAddressFieldHasvalue={setisAddressFieldHasvalue}
                              setIsLocationAddressFieldDirty={
                                setIsLocationAddressFieldDirty
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <AvoTextField
                              {...register("address.contact_no")}
                              id={FIELD.LOCATION_PHONE.UNIQUE_NAME}
                              label={FIELD.LOCATION_PHONE.LABEL}
                              placeholder={FIELD.LOCATION_PHONE.PLACEHOLDER}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <TextField
                              {...register("tip_out")}
                              id={FIELD.TIP_OUT.UNIQUE_NAME}
                              label={FIELD.TIP_OUT.LABEL}
                              placeholder={FIELD.TIP_OUT.PLACEHOLDER}
                              error={Boolean(errors.tip_out)}
                              helperText={errors.tip_out && errors.tip_out.message}
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <TextField
                              {...register("tax")}
                              id={FIELD.TAX.UNIQUE_NAME}
                              label={FIELD.TAX.LABEL}
                              placeholder={FIELD.TAX.PLACEHOLDER}
                              error={Boolean(errors.tax)}
                              helperText={errors.tax && errors.tax.message}
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item>
                                <FormControl>
                                  <Controller
                                    name="delivery_fees_type"
                                    control={control}
                                    defaultValue="fixed"
                                    render={({ field }) => (
                                      <Select {...field}>
                                        <MenuItem value="fixed">$</MenuItem>
                                        <MenuItem value="percentage">%</MenuItem>
                                      </Select>
                                    )}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs>
                                <AvoTextField
                                  {...register("delivery_fees")}
                                  id={FIELD.DELIVERY_CHARGES.UNIQUE_NAME}
                                  label={FIELD.DELIVERY_CHARGES.LABEL}
                                  placeholder={FIELD.DELIVERY_CHARGES.PLACEHOLDER}
                                  error={Boolean(errors.delivery_fees)}
                                  helperText={
                                    errors.delivery_fees &&
                                    errors.delivery_fees.message
                                  }
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                            </Grid>
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
                                {FIELD.RESTAURANT_BANNER.LABEL}
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

                          <Grid item className="mt-1">
                            <AvoTextField
                              {...register("prep_time")}
                              id={FIELD.LOCATION_PREP_TIME.UNIQUE_NAME}
                              label={FIELD.LOCATION_PREP_TIME.LABEL}
                              placeholder={FIELD.LOCATION_PREP_TIME.PLACEHOLDER}
                              error={Boolean(errors.prep_time)}
                              helperText={
                                errors.prep_time && errors.prep_time.message
                              }
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <AvoTextField
                              {...register("service_radius")}
                              id={FIELD.LOCATION_RADIUS.UNIQUE_NAME}
                              label={FIELD.LOCATION_RADIUS.LABEL}
                              placeholder={FIELD.LOCATION_RADIUS.PLACEHOLDER}
                              error={Boolean(errors.service_radius)}
                              helperText={
                                errors.service_radius &&
                                errors.service_radius.message
                              }
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <Password
                              {...register("secret_pin")}
                              error={Boolean(errors.secret_pin)}
                              helperText={
                                errors.secret_pin && errors.secret_pin.message
                              }
                              label="Pin"
                              placeholder="Enter your secret pin"
                              margin="none"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <Password
                              {...register("secret_key")}
                              error={Boolean(errors.secret_key)}
                              helperText={
                                errors.secret_key && errors.secret_key.message
                              }
                              label="Key"
                              placeholder="Enter your secret key"
                              margin="none"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          <Grid item>
                            <AvoTextField
                              {...register("opening_time")}
                              id={FIELD.OPENING_TIME.UNIQUE_NAME}
                              label={FIELD.OPENING_TIME.LABEL}
                              placeholder={FIELD.OPENING_TIME.PLACEHOLDER}
                              error={Boolean(errors.opening_time)}
                              helperText={
                                errors.opening_time &&
                                errors.opening_time.message
                              }
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              type="time"

                            />
                          </Grid>

                          <Grid item>
                            <AvoTextField
                              {...register("closing_time")}
                              id={FIELD.CLOSING_TIME.UNIQUE_NAME}
                              label={FIELD.CLOSING_TIME.LABEL}
                              placeholder={FIELD.CLOSING_TIME.PLACEHOLDER}
                              error={Boolean(errors.closing_time)}
                              helperText={
                                errors.closing_time &&
                                errors.closing_time.message
                              }
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              type="time"

                            />
                          </Grid>

                          <Grid item>
                            <FormControlLabel
                              sx={{
                                '.MuiFormControlLabel-label': {
                                  fontSize: '12px',
                                  color: "rgba(0, 0, 0, 0.6)"
                                }
                              }}
                              control={
                                <AvoSwitch
                                  {...register("pos")}
                                  name='pos'
                                  defaultChecked={
                                    true
                                  }
                                  disabled
                                />
                              }
                              label="POS"
                              labelPlacement="top"
                            />
                            <FormControlLabel
                              sx={{
                                '.MuiFormControlLabel-label': {
                                  fontSize: '12px',
                                  color: "rgba(0, 0, 0, 0.6)"
                                }
                              }}
                              control={
                                <AvoSwitch
                                  {...register("pickup")}
                                  name='pickup'
                                  defaultChecked={
                                    true
                                  }
                                />
                              }
                              label="Pickup"
                              labelPlacement="top"
                            />
                            <FormControlLabel
                              sx={{
                                '.MuiFormControlLabel-label': {
                                  fontSize: '12px',
                                  color: "rgba(0, 0, 0, 0.6)"
                                }
                              }}
                              control={
                                <AvoSwitch
                                  {...register("delivery")}
                                  name='delivery'
                                  defaultChecked={
                                    true
                                  }
                                />
                              }
                              label="Delivery"
                              labelPlacement="top"
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

          {/* </Grid> */}
        </DialogContent>
      </Dialog>
      <Grid container direction="column">
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          className="mb-1 header-top"
        >
          <Grid item>
            <Typography
              className="title"
              textAlign="left !important"
              fontSize="48px !important"
              marginBottom="35px !important"
            >
              {brandName}
            </Typography>
          </Grid>
          {session?.role === "brand_manager" &&
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={openNewItemModal}
                sx={{
                  color: "black",
                }}
              >
                {STRING.ADD_RESTAURANT}
              </Button>
            </Grid>
          }
        </Grid>

        <Grid item container direction="row" spacing={2}>
          {restaurants.map((restaurantItem) => {
            return (
              <Grid item key={restaurantItem.id}>
                <LocationCard {...restaurantItem} />
              </Grid>
            );
          })}
        </Grid>

      </Grid>
    </ManagerLayout>
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

export default Location;
