import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { isEmpty, isNil } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../../../styles/LocationSettings.module.css";
import AvoGoogleAutocomplete from "../../../../components/AvoGoogleAutocomplete";
import AvoTextField from "../../../../components/Fields/AvoTextField";
import Password from "../../../../components/Fields/Password";
import ImageCropper from "../../../../components/ImageCropper";
import ManagerLayout from "../../../../components/Layout/Manager";
import { LocationFormSchema } from "../../../../constants/ValidationSchema";
import { setupInterceptors } from "../../../../interceptors/axiosinterceptor";
import {
  APP_URL,
  FIELD,
  LINKS,
  SEVERITY,
  STRING,
} from "../../../../lib/constants";
import { showAlert } from "../../../../store/slice/alertSlice";
import { useUpdateAddressMutation } from "../../../api/address/addressApi";
import {
  useGetRestaurantDetailQuery,
  useUpdateRestaurantDetailMutation,
} from "../../../api/restaurant/restaurantApi";
import { requireAuthentication } from "../../../api/util/requireAuthentication";

const LocationSettings = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [restaurantObject, setRestaurantObject] = useState();

  useEffect(() => {
    const { accessToken } = props.session;
    if (accessToken) {
      setupInterceptors(accessToken);
    }
  }, [props]);
  const restaurantId = useSelector((state) => {
    return state.restaurant.restaurantId;
  });

  const [image, setImage] = useState("/assets/images/upload-icon.png");
  const [hasUserUploadImage, sethasUserUploadImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addressId, setAddressId] = useState(false);
  const [imgBase64, setimgBase64] = useState("");
  const [isAddressFieldHasvalue, setisAddressFieldHasvalue] = useState(false);
  const [formattedDefaultAddress, setformattedDefaultAddress] = useState("");
  const [isLocationAddressFieldDirty, setIsLocationAddressFieldDirty] =
    useState(false);
  const inputRef = useRef(null);
  const [chips, setChips] = useState([]);

  const {
    isLoading: isGetRestaurantDetailLoading,
    refetch: refetchRestaurantData,
    data: restaurantData,
  } = useGetRestaurantDetailQuery({
    id: restaurantId,
  });

  useEffect(() => {
    if (restaurantData) {
      setRestaurantObject(restaurantData.restaurant);
    }
  }, [restaurantData]);

  const [
    updateRestaurantDetail,
    {
      isSuccess: isUpdateRestaurantDetailSuccess,
      isLoading: isUpdateRestaurantDetailLoading,
      error: updateRestaurantError,
    },
  ] = useUpdateRestaurantDetailMutation();

  const [
    updateAddress,
    {
      isSuccess: isUpdateAddressSuccess,
      isLoading: isUpdateAddressLoading,
      error: updateRestaurantAddressError,
    },
  ] = useUpdateAddressMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields, isDirty },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(LocationFormSchema),
  });
  const watchChips = watch("chips");

  const setDefaultImageFromApi = () => {
    // set image/banner if media property is not null
    if (!isNil(restaurantObject?.media?.banner?.url)) {
      const bannerImage = `${APP_URL}${restaurantObject?.media?.banner?.url}`;
      setImage(bannerImage);
    }
  };

  const handleOnImageChange = async (event) => {
    const [file] = event.target.files;
    sethasUserUploadImage(true);
    setIsDialogOpen(true);
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const onDialogClose = (isSetDefaultImage = false) => {
    if (isSetDefaultImage) {
      setDefaultImageFromApi();
    }
    setIsDialogOpen(false);
  };

  useEffect(() => {
    // Set default values
    if (restaurantObject) {
      const {
        name,
        description,
        tip_out,
        tax,
        delivery_fees_type,
        delivery_fees,
        prep_time,
        service_radius,
        tags,
        secret_pin,
        secret_key,
      } = restaurantObject;
      const {
        id: restaurantAddressId,
        contact_no,
        formatted_address,
      } = restaurantObject.addresses;
      setAddressId(restaurantAddressId);
      setformattedDefaultAddress(formatted_address);
      const data = {
        name,
        description,
        tip_out,
        tax,
        delivery_fees_type,
        delivery_fees,
        prep_time,
        service_radius,
        address: {
          contact_no: contact_no,
        },
        secret_pin,
        secret_key,
      };

      setDefaultImageFromApi();
      reset(data);
      let defaultTags = tags.map((tagItem) => tagItem.name);
      setChips(defaultTags);
      // eslint-why will cause unnecessary re renders
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantObject, reset, setValue]);

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

  const onSubmit = async (data) => {
    const { address, ...request } = data;
    const apiRequest = dirtyValues(dirtyFields, data);
    apiRequest.tags = chips;
    const isAddressFieldDirty =
      (!isEmpty(apiRequest) &&
        !isEmpty(apiRequest.address) &&
        !isEmpty(apiRequest.address.contact_no)) ||
      isLocationAddressFieldDirty;

    const isRestaurantFieldDirty =
      !isEmpty(apiRequest.name) ||
      !isEmpty(apiRequest.description) ||
      !isEmpty(apiRequest.tip_out) ||
      !isEmpty(apiRequest.tax) ||
      !isEmpty(apiRequest.delivery_fees_type) ||
      !isEmpty(apiRequest.delivery_fees) ||
      !isEmpty(apiRequest.prep_time) ||
      !isEmpty(apiRequest.service_radius) ||
      !isEmpty(apiRequest.tags) ||
      !isEmpty(apiRequest.secret_pin) ||
      !isEmpty(apiRequest.secret_key);

    if (isRestaurantFieldDirty || !isEmpty(imgBase64)) {
      delete apiRequest.contact_no;
      delete apiRequest.address;
      apiRequest.id = restaurantId;
      if (hasUserUploadImage) {
        apiRequest.banner = imgBase64;
      }
      if (!isEmpty(apiRequest.tags)) {
        const formattedTags = apiRequest.tags.join(",").trim();
        apiRequest.tags = formattedTags;
      }
      await updateRestaurantDetail(apiRequest);
    }
    if (isAddressFieldDirty) {
      const { contact_no, details } = address;
      const apiRequestAddress = { id: addressId, contact_no, ...details };
      await updateAddress(apiRequestAddress);
    }

    // Reset dirty fields, so we'll not call unnecessary api calls the next submit.
    sethasUserUploadImage(false);
    setIsLocationAddressFieldDirty(false);
    setisAddressFieldHasvalue(false);
    reset(
      {},
      {
        keepValues: true,
      }
    );
  };

  useEffect(() => {
    if (updateRestaurantAddressError) {
      dispatch(
        showAlert({
          severity: SEVERITY.ERROR,
          text: "Please choose a proper location address",
        })
      );
    }
  }, [updateRestaurantAddressError]);

  useEffect(() => {
    if (updateRestaurantError) {
      const {
        data: {
          error: { message },
        },
      } = updateRestaurantError;

      dispatch(
        showAlert({
          severity: SEVERITY.ERROR,
          text: message,
        })
      );
    }
  }, [updateRestaurantError]);

  useEffect(() => {
    if (isUpdateRestaurantDetailSuccess || isUpdateAddressSuccess) {
      refetchRestaurantData();
      dispatch(
        showAlert({
          severity: SEVERITY.SUCCESS,
          text: "Location settings has been succesfully updated!",
        })
      );
    }
    // eslint-why will cause unnecessary re renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateRestaurantDetailSuccess, isUpdateAddressSuccess]);

  useEffect(() => {
    setIsLoading(
      isUpdateRestaurantDetailLoading ||
      isGetRestaurantDetailLoading ||
      isUpdateAddressLoading
    );
  }, [
    isUpdateRestaurantDetailLoading,
    isGetRestaurantDetailLoading,
    isUpdateAddressLoading,
  ]);

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
    <ManagerLayout enableMenuBar={true} isLoading={isLoading}>
      <ImageCropper
        open={isDialogOpen}
        onClose={onDialogClose}
        {...{ image, setImage, setimgBase64 }}
      />
      <form id="restaurant-detail-form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container direction="column">
          <Grid item>
            <Typography
              className="title"
              textAlign="left !important"
              fontSize="48px !important"
              marginBottom="36px !important"
              marginTop="15px !important"
            >
              {STRING.LOCATION_SETTING}
            </Typography>
          </Grid>
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
              <CardContent>
                <Grid container direction="row">
                  <Grid item className={`${styles["card-1"]}`}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <AvoTextField
                          {...register("name")}
                          id={FIELD.LOCATION_NAME.UNIQUE_NAME}
                          label={FIELD.LOCATION_NAME.LABEL}
                          placeholder={FIELD.LOCATION_NAME.PLACEHOLDER}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item>
                        <AvoTextField
                          {...register("description")}
                          id={FIELD.LOCATION_DESC.UNIQUE_NAME}
                          label={FIELD.LOCATION_DESC.LABEL}
                          placeholder={FIELD.LOCATION_DESC.PLACEHOLDER}
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
                          defaultFormattedAddress={formattedDefaultAddress}
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
                                defaultValue=""
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
                            {FIELD.LOCATION_BANNER.LABEL}
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
                    </Grid>
                  </Grid>
                </Grid>

                <Divider
                  variant="middle"
                  flexItem
                  style={{ margin: "5rem 2rem 2rem" }}
                />

                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="neutral"
                      onClick={() => router.push(LINKS.MANAGER_LOCATION)}
                      className={styles["action-btn"]}
                    >
                      {STRING.CANCEL}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      className={styles["action-btn"]}
                      disabled={
                        (isEmpty(imgBase64) || !isEmpty(errors)) &&
                        !isDirty &&
                        !isAddressFieldHasvalue
                      }
                    >
                      {STRING.SAVE}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
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

export default LocationSettings;
