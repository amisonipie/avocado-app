import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Slide,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { find, isEmpty } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../../../../../styles/SubCategory.module.css";
import AvoBreadcrumbs from "../../../../../../components/AvoBreadcrumbs";
import AvoTextField from "../../../../../../components/Fields/AvoTextField";
import CloseIcon from "../../../../../../components/Icon/CloseIcon";
import TooltipIcon from "../../../../../../components/Icon/TooltipIcon";
import ManagerLayout from "../../../../../../components/Layout/Manager";
import AvoFoodItemCard from "../../../../../../components/Manager/Location/Menu/AvoFoodItemCard";
import AvoSwitch from "../../../../../../components/Switch";
import { setupInterceptors } from "../../../../../../interceptors/axiosinterceptor";
import {
  FIELD,
  LINKS,
  SEVERITY,
  STRING,
} from "../../../../../../lib/constants";
import { showAlert } from "../../../../../../store/slice/alertSlice";
import { useGetCategoryListQuery } from "../../../../../api/category/categoryApi";
import { useGetFlavorByRestaurantIdQuery } from "../../../../../api/flavor/flavorApi";
import {
  useAddFoodItemMutation,
  useGetFoodItemByCategoryIdQuery,
  useUpdateFoodItemMutation,
} from "../../../../../api/food-item/foodItemApi";
import { useGetModifierListQuery } from "../../../../../api/modifier/modifierApi";
import { requireAuthentication } from "../../../../../api/util/requireAuthentication";
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

export const Category = (props) => {
  useEffect(() => {
    const { accessToken } = props.session;
    if (accessToken) {
      setupInterceptors(accessToken);
    }
  }, [props]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [foodItems, setFoodItems] = useState([]);
  const [isEditMode, setisEditMode] = useState(false);
  const [modifierId, setModifierId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currendItemInView, setCurrendItemInView] = useState("New Item");
  const [modifierItemOptions, setModifierItemOptions] = useState([]);
  const [foodItemModifier, setFoodItemModifier] = useState("");
  const [currentCategoryData, setCurrentCategoryData] = useState({
    id: "",
    name: "",
  });
  const categoryId = router.query.id;
  const [showNewItemModal, setShowNewItemModal] = React.useState(false);
  const [foodItemMods, setFoodItemMods] = React.useState([]);
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
  const watchModifierId = watch("modifierId");

  const restaurantId = useSelector((state) => {
    return state.restaurant.restaurantId;
  });

  const { data: categoryData, isLoading: isGetCategoryListLoading } =
    useGetCategoryListQuery({
      restaurantId,
    });

  useEffect(() => {
    if (categoryData && categoryId) {
      const data = find(categoryData.result.data.categories, {
        id: categoryId,
      });
      setCurrentCategoryData(data);
    }
  }, [categoryData, categoryId]);

  const { data: modifiersData, isLoading: isGetModifierListLoading } =
    useGetModifierListQuery({
      restaurantId,
    });

  useEffect(() => {
    if (modifiersData && modifiersData.success === true) {
      const foodItemMods = filterModifiersByCategory(
        modifiersData.data.modifier,
        categoryId
      );
      setModifierId(foodItemMods[0]?.id);
      // setFoodItemMods(foodItemMods);

      setFoodItemModifier(foodItemMods[0]?.name);
      const arr = foodItemMods[0]?.modifier_item.map(({ id, name }) => {
        return {
          id,
          name,
        };
      });
      setModifierItemOptions(arr);
    }
  }, [modifiersData]);

  const {
    data: foodItemData,
    isLoading: isGetFoodItemByCategoryLoading,
    refetch,
  } = useGetFoodItemByCategoryIdQuery({
    categoryId,
  });

  useEffect(() => {
    if (foodItemData) {
      setFoodItems(foodItemData);
    }
  }, [foodItemData]);

  const {
    data: flavorFromRestaurantData,
    isLoading: isGetFlavorByRestaurantLoading,
  } = useGetFlavorByRestaurantIdQuery({
    restaurantId,
  });

  const [addFoodItem, { isSuccess: isAddFoodItemSuccess }] =
    useAddFoodItemMutation();

  const [
    updateFoodItem,
    { isSuccess: isUpdateFoodItemSuccess, isLoading: isUpdateFoodItemLoading },
  ] = useUpdateFoodItemMutation();

  useEffect(() => {
    setIsLoading(
      isGetCategoryListLoading ||
      isGetModifierListLoading ||
      isGetFoodItemByCategoryLoading ||
      isGetFlavorByRestaurantLoading
    );
  }, [
    isGetCategoryListLoading,
    isGetModifierListLoading,
    isGetFoodItemByCategoryLoading,
    isGetFlavorByRestaurantLoading,
  ]);

  const breadcrumbs = {
    items: [
      {
        text: STRING.MENU,
        url: LINKS.LOCATION_MENU,
      },
      {
        text: STRING.CATEGORIES,
        url: LINKS.MENU_CATEGORIES,
      },
      {
        text: currentCategoryData.name,
      },
    ],
  };
  const newItemBreadcrumbs = {
    items: [
      {
        text: currentCategoryData.name,
        url: "#",
        onClick: () => setShowNewItemModal(false),
      },
      {
        text: currendItemInView,
      },
    ],
  };
  const availability = {
    items: [
      {
        label: "POS",
        labelPlacement: "top",
      },
      {
        label: "Pickup",
        labelPlacement: "top",
      },
      {
        label: "Delivery",
        labelPlacement: "top",
      },
    ],
  };

  const openNewItemModal = () => {
    setisEditMode(false);
    reset();
    setShowNewItemModal(true);
  };

  const closeNewItemModal = () => {
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

  const onSubmit = async (data) => {
    console.log(data);
    const body = {
      ...data,
      category_id: data.category_id.value,
      flavor_id: data.flavor_id.id,
      code: data.SKU,
      price: parseFloat(data.price),
      pos: +data.pos || 0,
      pickup: +data.pickup || 0,
      delivery: +data.delivery || 0,
      is_recommended: parseInt(data.is_recommended),
      status: +data.status,
    };
    if (modifierId) {
      body.modifier_id = modifierId;
    }
    if (isEditMode === false) {
      const { switch_form, status, ...request } = body;
      await addFoodItem(request);
    } else {
      const { switch_form, updated_at, modifier, ...request } = body;
      await updateFoodItem(request);
    }
    setShowNewItemModal(false);
  };

  const filterModifiersByCategory = (modifiers, categoryId) => {
    const filteredModifiers = modifiers?.filter((modifier) => {
      return (
        modifier?.category?.filter((category) => {
          if (category?.id == categoryId) {
            return true;
          }
        })?.length > 0
      );
    });

    return filteredModifiers;
  };

  useEffect(() => {
    if (getValues("modifier_id")) {
      console.log(getValues("modifier_id"));
    }
  }, [getValues("modifier_id")]);

  const FoodItemAppBar = () => {
    return (
      <AppBar className={`${styles["dialog-appbar"]}`} elevation={0}>
        <Toolbar>
          <Grid item container direction="row" justifyContent="space-between">
            <Grid item sx={{ paddingTop: "5px" }}>
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
                    }}
                  >
                    {STRING.CANCEL}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    type="submit"
                    form="hook-form"
                    sx={{
                      color: "black",
                    }}
                  >
                    {STRING.SAVE}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  };

  const isPriceValid = (price) => {
    return Number(price) > 0;
  };

  const BasicInformationCard = () => {
    return (
      <Grid item>
        <Card className={`${styles["card-1"]}`}>
          <CardHeader
            title={
              <Typography className={`${styles["dialog-card-title"]}`}>
                Basic Information
              </Typography>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <AvoTextField
                    {...register("name")}
                    id={FIELD.ITEM_NAME.UNIQUE_NAME}
                    label={FIELD.ITEM_NAME.LABEL}
                    placeholder={FIELD.ITEM_NAME.PLACEHOLDER}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Tooltip title="This is a Tooltip" placement="top">
                    <IconButton>
                      <TooltipIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <AvoTextField
                    {...register("description")}
                    id={FIELD.ITEM_DESC.UNIQUE_NAME}
                    label={FIELD.ITEM_DESC.LABEL}
                    placeholder={FIELD.ITEM_DESC.PLACEHOLDER}
                    fullWidth
                    multiline
                    rows={5}
                  />
                </Grid>
                <Grid item>
                  <Tooltip title="This is a Tooltip" placement="top">
                    <IconButton>
                      <TooltipIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <AvoTextField
                    {...register("price", {
                      validate: isPriceValid,
                    })}
                    label="Price"
                    error={!isEmpty(errors?.price?.type)}
                    helperText={
                      !isEmpty(errors?.price?.type)
                        ? "Price should be greater than 0."
                        : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Tooltip title="This is a Tooltip" placement="top">
                    <IconButton>
                      <TooltipIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <Controller
                    name="flavor_id"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        disablePortal
                        onChange={(event, item) => {
                          onChange(item);
                        }}
                        value={value}
                        options={flavorFromRestaurantData}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <AvoTextField
                            {...params}
                            label={FIELD.ITEM_FLAVOUR.LABEL}
                            name={FIELD.ITEM_FLAVOUR.LABEL}
                            placeholder={FIELD.ITEM_FLAVOUR.PLACEHOLDER}
                            value={params.id}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <Tooltip title="This is a Tooltip" placement="top">
                    <IconButton>
                      <TooltipIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      {FIELD.ITEM_RECOMMENDED.LABEL}
                    </FormLabel>
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="is_recommended"
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={0}
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Tooltip title="This is a Tooltip" placement="top">
                    <IconButton>
                      <TooltipIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Autocomplete
                          disablePortal
                          onChange={(event, item) => {
                            onChange(item);
                          }}
                          value={value}
                          options={[
                            {
                              label: currentCategoryData.name,
                              value: currentCategoryData.id,
                            },
                          ]}
                          renderInput={(params) => (
                            <AvoTextField
                              {...params}
                              label={FIELD.ITEM_CATEGORY.LABEL}
                              name={FIELD.ITEM_CATEGORY.LABEL}
                              placeholder={FIELD.ITEM_CATEGORY.PLACEHOLDER}
                            />
                          )}
                        />
                      );
                    }}
                  />
                </Grid>
                <Grid item>
                  <Tooltip title="This is a Tooltip" placement="top">
                    <IconButton>
                      <TooltipIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <AvoTextField
                    {...register("SKU")}
                    id={FIELD.ITEM_CODE.UNIQUE_NAME}
                    label={FIELD.ITEM_CODE.LABEL}
                    placeholder={FIELD.ITEM_CODE.PLACEHOLDER}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <Tooltip title="This is a Tooltip" placement="top">
                    <IconButton>
                      <TooltipIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const AvailabilityAndTagsCard = () => {
    return (
      <Grid item>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Card className={`${styles["card-2"]}`}>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <CardHeader
                    title={
                      <Typography className={`${styles["dialog-card-title"]}`}>
                        {STRING.AVAILABILITY}
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item>
                  <CardContent>
                    <Box display="flex">
                      {availability.items.map((switchItem) => {
                        return (
                          <>
                            <Controller
                              control={control}
                              name="switch_form"
                              defaultValue={true}
                              render={({ value, field: { onChange } }) => {
                                return (
                                  <FormControlLabel
                                    control={
                                      <AvoSwitch
                                        disabled={switchItem.label.toLowerCase() === "pos"}
                                        value={value}
                                        onChange={(event, val) => {
                                          setValue(
                                            switchItem.label.toLowerCase(),
                                            val
                                          );
                                          onChange(val);
                                        }}
                                        defaultChecked={getValues(
                                          switchItem.label.toLowerCase()
                                        )}
                                      />
                                    }
                                    label={switchItem.label}
                                    labelPlacement={switchItem.labelPlacement}
                                  />
                                );
                              }}
                            />
                          </>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const [isConfimationModalOpen, setisConfimationModalOpen] = useState(false);

  const ToggleStatusModal = () => {
    return (
      <>
        <Modal open={isConfimationModalOpen}>
          <Grid
            container
            sx={addItemModalStyle}
            justifyContent="center"
            direction="column"
          >
            <Grid item>
              <IconButton
                className={`${styles["modal-close-btn"]}`}
                onClick={() => {
                  setisConfimationModalOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography className="title" textAlign="center">
                Set Modifier to Inactive
              </Typography>
            </Grid>
            <Grid item className="mb-2">
              <Typography
                textAlign="center"
                fontSize="16px"
                color="black"
                fontWeight={400}
              >
                Setting this modifier to
                <Typography component="span" color="#F44336">
                  {" "}
                  inactive{" "}
                </Typography>
                will only affect this item.
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
                    setValue("status", 1);
                    setisConfimationModalOpen(false);
                  }}
                  className={styles["modal-btn"]}
                >
                  {STRING.CANCEL}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  className={styles["modal-btn"]}
                  variant="contained"
                  onClick={() => {
                    setisConfimationModalOpen(false);
                  }}
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Modal>
      </>
    );
  };

  const showConfimationDialog = () => {
    setisConfimationModalOpen(true);
  };

  const ModifiersCard = () => {
    return (
      <Grid item sx={{ flex: 1 }}>
        <Grid item>
          <Card>
            <CardHeader
              title={
                <Typography className={`${styles["dialog-card-title"]}`}>
                  {STRING.MODIFIERS}
                </Typography>
              }
              subheader={
                <Typography
                  variant="body1"
                  sx={{
                    color: "#696969",
                  }}
                  fontSize="16px"
                  fontWeight="700"
                >
                  Note: Add and edit modifers in
                  <span style={{ color: "var(--green-700)" }}>
                    {" "}
                    Menu
                  </span> &gt;{" "}
                  <span style={{ color: "var(--green-500)" }}>Modifiers</span>.
                </Typography>
              }
            />
            {foodItemModifier && (
              <>
                <hr style={{ marginLeft: "16px", marginRight: "16px" }}></hr>
                <CardContent>
                  <Grid
                    display="grid"
                    container
                    direction="row"
                    alignItems="center"
                    gridTemplateColumns="1fr 1fr 2fr"
                  >
                    <Grid item>
                      <Typography fontWeight="600" fontSize="20px">
                        {foodItemModifier}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Controller
                        control={control}
                        name="status"
                        render={({ value, field: { onChange } }) => {
                          return (
                            <FormControlLabel
                              control={
                                <AvoSwitch
                                  value={value}
                                  onChange={(event, val) => {
                                    if (val === false) {
                                      // if setting the status to inactive, show the confimation
                                      // else, dont show.
                                      showConfimationDialog();
                                    }
                                    onChange(val);
                                  }}
                                  defaultChecked={getValues("status")}
                                />
                              }
                              label={
                                getValues("status") ? "Active" : "Inactive"
                              }
                              labelPlacement="start"
                            />
                          );
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Controller
                        name="chef_rec_mod_item_id"
                        control={control}
                        render={({ field: { onChange, value, name } }) => {
                          return (
                            <FormControl sx={{ m: 1, width: 300 }}>
                              <InputLabel id="demo-select-small">
                                Chef Pick
                              </InputLabel>
                              <Select
                                name={name}
                                label="Chef Pick"
                                onChange={(event) => {
                                  onChange(event.target.value);
                                }}
                                value={value}
                              >
                                {modifierItemOptions?.map((option) => {
                                  return (
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
                </CardContent>
              </>
            )}
          </Card>
        </Grid>
        <ToggleStatusModal />
      </Grid>
    );
  };

  const handleClick = (foodItem) => {
    reset();
    setCurrendItemInView(foodItem.name);
    setisEditMode(true); // if edit mode is true, call UPDATE api upon submission.
    setShowNewItemModal(true);

    if (!isEmpty(foodItem.modifier)) {
      const currentModifier = foodItem.modifier[0];
      const arr = currentModifier.modifier_item.map(({ id, name }) => {
        return {
          id,
          name,
        };
      });
      setModifierItemOptions(arr);
      setFoodItemModifier(currentModifier.name);
    }
    Object.keys(foodItem).map((key) => {
      const value = foodItem[key];
      if (key === "flavor_id") {
        const flavorData = find(flavorFromRestaurantData, { id: value });
        setValue(key, flavorData);
      } else if (key === "is_recommended") {
        setValue(key, +value);
      } else if (key === "category_id") {
        const categoryValue = {
          label: currentCategoryData.name,
          value: currentCategoryData.id,
        };
        setValue(key, categoryValue);
      } else {
        setValue(key, value);
      }
    });
  };

  useEffect(() => {
    if (isAddFoodItemSuccess || isUpdateFoodItemSuccess) {
      refetch();
      if (isAddFoodItemSuccess) {
        dispatch(
          showAlert({
            severity: SEVERITY.SUCCESS,
            text: "Food item has been succesfully created!",
          })
        );
      }
      if (isUpdateFoodItemSuccess) {
        dispatch(
          showAlert({
            severity: SEVERITY.SUCCESS,
            text: "Food item has been succesfully updated!",
          })
        );
      }
    }
    // eslint-why will cause unnecessary re renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddFoodItemSuccess, isUpdateFoodItemSuccess]);

  return (
    <ManagerLayout enableMenuBar={true} isLoading={isLoading}>
      <Dialog
        fullScreen
        open={showNewItemModal}
        onClose={closeNewItemModal}
        TransitionComponent={Transition}
      >
        <FoodItemAppBar />
        <Toolbar></Toolbar>
        <DialogContent dividers className={`${styles["dialog-content"]}`}>
          <form id="hook-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container direction="row" spacing={2}>
              <BasicInformationCard />
              <AvailabilityAndTagsCard />
              <ModifiersCard />
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
          className="mb-1 header-top"
        >
          <Grid item>
            <AvoBreadcrumbs {...breadcrumbs} />
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
              {STRING.ADD + " " + currentCategoryData.name}
            </Button>
          </Grid>
        </Grid>

        <Grid container item direction="row" spacing={2}>
          {foodItems.map((foodItem) => {
            return (
              <Grid item key={foodItem.id}>
                <AvoFoodItemCard
                  {...foodItem}
                  onClick={() => handleClick(foodItem)}
                />
              </Grid>
            );
          })}
          {isEmpty(foodItems) && (
            <Typography marginLeft="15px" textAlign="center">
              No food items created yet.
            </Typography>
          )}
        </Grid>
      </Grid>
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

export default Category;
