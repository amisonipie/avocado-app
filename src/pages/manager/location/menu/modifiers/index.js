import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ClearIcon from "@mui/icons-material/Clear";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Divider,
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
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import { find, isEmpty, size } from "lodash";
import { getCsrfToken } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../../../../styles/Modifiers.module.css";
import AddCategoryModal from "../../../../../components/AddCategoryModal";
import AvoAutoComplete from "../../../../../components/AvoAutoComplete";
import AvoBreadcrumbs from "../../../../../components/AvoBreadcrumbs";
import AvoTextField from "../../../../../components/Fields/AvoTextField";
import CloseIcon from "../../../../../components/Icon/CloseIcon";
import TooltipIcon from "../../../../../components/Icon/TooltipIcon";
import ManagerLayout from "../../../../../components/Layout/Manager";
import AvoModifierCard from "../../../../../components/Manager/Location/Menu/AvoModifierCard";
import ModifierContainer from "../../../../../components/ModifierContainer";
import AvoSwitch from "../../../../../components/Switch";
import { setupInterceptors } from "../../../../../interceptors/axiosinterceptor";
import { FIELD, LINKS, SEVERITY, STRING } from "../../../../../lib/constants";
import { getLastUpdatedDateTimeFrmArr } from "../../../../../lib/utils";
import { showAlert } from "../../../../../store/slice/alertSlice";
import { useGetCategoryListQuery } from "../../../../api/category/categoryApi";
import {
  useAddModifierItemMutation,
  useDeleteModifierItemMutation,
  useUpdateModifierItemMutation,
} from "../../../../api/modifier-item/modifierItemApi";
import {
  useAddModifierMutation,
  useGetModifierListQuery,
  useUpdateModifierMutation,
} from "../../../../api/modifier/modifierApi";
import { useGetTemperatureListQuery } from "../../../../api/temperature/temperatureApi";
import { requireAuthentication } from "../../../../api/util/requireAuthentication";
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
const breadcrumbs = {
  items: [
    {
      text: STRING.MENU,
      url: LINKS.LOCATION_MENU,
    },
    {
      text: STRING.MODIFIERS,
    },
  ],
};
const availability = {
  items: [
    {
      label: "POS",
      labelPlacement: "top",
      defaultChecked: false,
    },
    {
      label: "Pickup",
      labelPlacement: "top",
      defaultChecked: true,
    },
    {
      label: "Delivery",
      labelPlacement: "top",
      defaultChecked: true,
    },
  ],
};

const temperatureOptions = ["Off", "On", "Eggs", "Meat"];
const statusOptions = [
  { name: "Active", value: 1 },
  { name: "Inactive", value: 0 },
];

const Modifiers = (props) => {
  useEffect(() => {
    const { accessToken } = props.session;
    if (accessToken) {
      setupInterceptors(accessToken);
    }
  }, [props]);
  const dispatch = useDispatch();

  const [showNewItemModal, setShowNewItemModal] = React.useState(false);
  const [currentModifierName, setcurrentModifierName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [isAddItemModalOpen, setisAddItemModalOpen] = React.useState(false);
  const [isDeleteModModalOpen, setIsDeleteModModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modifiers, setModifiers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modifierItemList, setModifierItemList] = useState([]);
  const [modifierItemData, setModifierItemData] = useState(null);
  const [isDeleteOptionVisible, setisDeleteOptionVisible] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [currentEditingItem, setcurrentEditingItem] =
    useState("New Modifier Group");

  const [currentModifierID, setcurrentModifierID] = useState("");
  const [currentModifierItemId, setCurrentModifierItemId] = useState("");
  const [hasExistingModifierItems, sethasExistingModifierItems] =
    useState(false);

  let sortedModItemList = [];

  const { register, handleSubmit, control, setValue, getValues, reset } =
    useForm();

  const {
    register: registerModifierItem,
    handleSubmit: handleSubmitModifierItem,
    control: controlModifierItem,
    setValue: setValueModifierItem,
    reset: resetModifierItem,
  } = useForm();

  const restaurantId = useSelector((state) => {
    return state.restaurant.restaurantId;
  });

  const {
    data: modifiersData,
    isLoading: isGetModifierListLoading,
    refetch: refetchModifiers,
  } = useGetModifierListQuery({
    restaurantId,
  });

  const [
    addModifier,
    { isSuccess: isAddModifierSuccess, data: addModifierData },
  ] = useAddModifierMutation();

  const [updateModifier, { isSuccess: isUpdateModifierSuccess }] =
    useUpdateModifierMutation();

  const [
    updateModifierItem,
    {
      isSuccess: isUpdateModifierItemSuccess,
      isLoading: isUpdateModifierItemLoading,
    },
  ] = useUpdateModifierItemMutation();

  const [deleteModifierItem, { isSuccess: isDeleteModifierItemSuccess }] =
    useDeleteModifierItemMutation();

  const [addModifierItem, { isSuccess: isAddModifierItemSuccess }] =
    useAddModifierItemMutation();

  const { data: categoryData, isLoading: isGetCategoryListLoading } =
    useGetCategoryListQuery({
      restaurantId,
    });

  const { data: temperatureData, isLoading: isGetTemperatureListLoading } =
    useGetTemperatureListQuery();

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData.result.data.categories);
    }
  }, [categoryData]);

  useEffect(() => {
    if (modifiersData) {
      setModifiers(modifiersData.data.modifier);
    }
  }, [modifiersData]);

  useEffect(() => {
    if (isAddModifierSuccess || isUpdateModifierSuccess) {
      refetchModifiers();
      if (isAddModifierSuccess) {
        dispatch(
          showAlert({
            severity: SEVERITY.SUCCESS,
            text: "Modifier has been succesfully created!",
          })
        );
      }
      if (isUpdateModifierSuccess) {
        dispatch(
          showAlert({
            severity: SEVERITY.SUCCESS,
            text: "Modifier has been succesfully updated!",
          })
        );
      }
    }
  }, [isAddModifierSuccess, isUpdateModifierSuccess]);

  useEffect(() => {
    if (
      isUpdateModifierItemSuccess ||
      isAddModifierItemSuccess ||
      isDeleteModifierItemSuccess
    ) {
      refetchModifiers();

      if (isAddModifierItemSuccess) {
        dispatch(
          showAlert({
            severity: SEVERITY.SUCCESS,
            text: "Modifier item has been succesfully created!",
          })
        );
      }
      if (isUpdateModifierItemSuccess) {
        dispatch(
          showAlert({
            severity: SEVERITY.SUCCESS,
            text: "Modifier item has been succesfully updated!",
          })
        );
      }

      if (isDeleteModifierItemSuccess) {
        dispatch(
          showAlert({
            severity: SEVERITY.SUCCESS,
            text: "Modifier item has been succesfully deleted!",
          })
        );
      }
    }
  }, [
    isAddModifierItemSuccess,
    isUpdateModifierItemSuccess,
    isDeleteModifierItemSuccess,
  ]);

  useEffect(() => {
    setIsLoading(
      isGetCategoryListLoading === true ||
      isGetModifierListLoading === true ||
      isGetTemperatureListLoading
    );
  }, [
    isGetCategoryListLoading,
    isGetModifierListLoading,
    isGetTemperatureListLoading,
  ]);

  const newItemBreadcrumbs = {
    items: [
      {
        text: STRING.MODIFIERS,
        onClick: () => closeNewItemModal(),
      },
      {
        text: currentEditingItem,
      },
    ],
  };

  const openNewItemModal = () => {
    setisEditMode(false);
    reset();
    resetModifierItem();
    setModifierItemList([]);
    setShowNewItemModal(true);
  };

  const closeNewItemModal = () => {
    setShowNewItemModal(false);
    setcurrentModifierID("");
    setCurrentModifierItemId("");
  };

  const onSubmit = async (data) => {
    let modItemPriority = [];
    if (sortedModItemList !== modifierItemList) {
      setModifierItemList(sortedModItemList);
      for (let i = 0; i < sortedModItemList.length; i++) {
        modItemPriority.push({
          priority: i,
          modifier_item_id: sortedModItemList[i].id,
        });
      }
    }

    reset();
    resetModifierItem();
    const { is_recommended, switch_form, ...request } = data;
    request.pos = +request.pos || 0;
    request.delivery = +request.delivery || 0;
    request.pickup = +request.pickup || 0;
    request.is_required = parseInt(request.is_required);
    request.restaurant_id = restaurantId;
    request.category_ids = request.category_ids.map(
      (categoryItem) => categoryItem.id
    );
    if (modItemPriority.length > 0) {
      isModifierFormDirty.current = true;
      request.priority_array = modItemPriority;
    }
    if (isEditMode) {
      const { status, ...rest } = request;
      if (isModifierFormDirty.current) {
        await updateModifier(rest);
      }
    } else {
      await addModifier(request);
    }
    isModifierFormDirty.current = false;
    isModifierItemFormDirty.current = false;
    closeNewItemModal();
  };

  const onSubmitModifierItem = async (data) => {
    const newModifierItem = {
      name: data.name,
      price: data.price,
      description: data.description,
      status: data.is_active,
      temperature_id: data.temperature_id.id,
      ...(data.temperature_item_id && {
        temperature_item_id: data.temperature_item_id,
      }),
      is_active: data.is_active,
      is_favorite: 0,
    };

    if (currentModifierItemId) {
      newModifierItem["id"] = currentModifierItemId;
      await updateModifierItem(newModifierItem);
      setCurrentModifierItemId("");
    } else {
      newModifierItem["modifier_id"] = currentModifierID;
      await addModifierItem(newModifierItem);
    }

    setOpen(false);
    dispatch(
      showAlert({
        severity: SEVERITY.INFO,
        text: "Modifier item has been saved.",
      })
    );
  };

  useEffect(() => {
    if (modifiers) {
      if (currentModifierID) {
        const newModifierItemList = modifiers.find(
          (mod) => mod.id === currentModifierID
        );
        setModifierItemList(newModifierItemList.modifier_item);
      }
    }
  }, [modifiers]);

  // useEffect(() => {
  //   // Upon successful creation of POST Modifier, send POST request to modifier-items immediately.
  //   const sendRequest = async () => {
  //     const { modifier_id } = addModifierData;
  //     const request = { ...modifierItemData, modifier_id };
  //     await addModifierItem(request);
  //   };
  //   if (isAddModifierSuccess && addModifierData) {
  //     sendRequest();
  //   }
  // }, [isAddModifierSuccess, addModifierData, modifierItemData]);

  const InputTooltip = () => {
    return (
      <Tooltip title="This is a Tooltip" placement="top">
        <IconButton>
          <TooltipIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const DrawerContent = () => {
    return (
      <Card className={`${styles["drawer-content-card"]}`}>
        <form onSubmit={handleSubmitModifierItem(onSubmitModifierItem)}>
          <CardContent className={`${styles["drawer-content-body"]}`}>
            <Grid container spacing={2}>
              <Grid item container direction="column" spacing={2}>
                <Grid item>
                  <Typography className={`${styles["dialog-card-title"]}`}>
                    Option
                  </Typography>
                </Grid>
                <Grid item container direction="row" alignItems="center">
                  <Grid item sx={{ flex: 1 }}>
                    <AvoTextField
                      label="Name"
                      {...registerModifierItem("name", {
                        onChange: () => {
                          isModifierItemFormDirty.current = true;
                        },
                      })}
                      placeholder={FIELD.ITEM_NAME.PLACEHOLDER}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <InputTooltip />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <AvoTextField
                    label="Price"
                    {...registerModifierItem("price", {
                      onChange: () => {
                        isModifierItemFormDirty.current = true;
                      },
                    })}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item>
                  <InputTooltip />
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <AvoTextField
                    label="Description"
                    {...registerModifierItem("description", {
                      onChange: () => {
                        isModifierItemFormDirty.current = true;
                      },
                    })}
                    fullWidth
                    required
                    multiline
                    rows="6"
                  />
                </Grid>
                <Grid item>
                  <InputTooltip />
                </Grid>
              </Grid>

              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Controller
                      name="is_active"
                      control={controlModifierItem}
                      render={({ field: { onChange, value, name } }) => {
                        return (
                          <Select
                            name={name}
                            label="Status"
                            onChange={(event) => {
                              isModifierItemFormDirty.current = true;
                              onChange(event.target.value);
                            }}
                            value={value}
                          >
                            {statusOptions.map((option) => {
                              return (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <InputTooltip />
                </Grid>
              </Grid>

              <Divider className={`${styles["divider"]}`} />
              <Grid item container direction="row" alignItems="center">
                <Grid item sx={{ flex: 1 }}>
                  <AvoAutoComplete
                    control={controlModifierItem}
                    options={temperatureOptions}
                    name="temperature"
                    label="Temperature"
                    items={temperatureData}
                    isModifierItemFormDirtyRef={isModifierItemFormDirty}
                  />
                </Grid>
                <Grid item>
                  <InputTooltip />
                </Grid>
              </Grid>
              <Divider className={`${styles["drawer-divider"]}`} />
              <Grid item container direction="row" spacing={3}>
                <Grid
                  item
                  container
                  className={`${styles["grid-item-center"]}`}
                >
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#BDBDBD", color: "black" }}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ color: "black" }}
                  >
                    Save
                  </Button>
                </Grid>
                {isEditMode && isDeleteOptionVisible && (
                  <Grid
                    item
                    container
                    className={`${styles["grid-item-center"]}`}
                  >
                    <Button
                      variant="text"
                      sx={{ color: "red" }}
                      onClick={() => {
                        setOpen(false);
                        setIsDeleteModModalOpen(true);
                      }}
                    >
                      Delete Option
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    );
  };

  const isModifierFormDirty = React.useRef(false);
  const isModifierItemFormDirty = React.useRef(false);

  const ModifierNameSection = () => {
    return (
      <Grid item container direction="row" alignItems="center">
        <Grid item sx={{ flex: 1 }}>
          <AvoTextField
            {...register("name", {
              onChange: () => {
                isModifierFormDirty.current = true;
              },
            })}
            id={FIELD.ITEM_NAME.UNIQUE_NAME}
            label="Modifer Group Name"
            placeholder={FIELD.ITEM_NAME.PLACEHOLDER}
            fullWidth
          />
        </Grid>
        <Grid item>
          <InputTooltip />
        </Grid>
      </Grid>
    );
  };

  const RequiredSection = () => {
    return (
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        marginLeft="30px"
      >
        <Grid item sx={{ flex: 1 }}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Required
            </FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="is_required"
              render={({ field: { onChange, ...rest } }) => (
                <RadioGroup
                  onChange={(selected) => {
                    isModifierFormDirty.current = true;
                    return onChange(selected);
                  }}
                  {...rest}
                >
                  <FormControlLabel value={1} control={<Radio />} label="Yes" />
                  <FormControlLabel value={0} control={<Radio />} label="No" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <InputTooltip />
        </Grid>
      </Grid>
    );
  };

  const TypeOfModiferGroupSection = () => {
    return (
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        marginLeft="30px"
      >
        <Grid item sx={{ flex: 1 }}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Type of Modifier Group
            </FormLabel>
            <Controller
              rules={{ required: true }}
              control={control}
              name="type"
              render={({ field: { onChange, ...rest } }) => (
                <RadioGroup
                  onChange={(selected) => {
                    isModifierFormDirty.current = true;
                    return onChange(selected);
                  }}
                  {...rest}
                >
                  <FormControlLabel
                    value="single"
                    control={<Radio />}
                    label="Single Select"
                  />
                  <FormControlLabel
                    value="multiple"
                    control={<Radio />}
                    label="Multiple Select"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <InputTooltip />
        </Grid>
      </Grid>
    );
  };

  const SelectCheckBoxOption = () => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    return (
      <Grid item container direction="row" alignItems="center">
        <Grid item sx={{ flex: 1 }}>
          <Controller
            name="category_ids"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Autocomplete
                  multiple
                  options={categories}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option, { selected }) => {
                    return (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    );
                  }}
                  fullWidth
                  value={getValues("category_ids")}
                  onChange={(event, selectedOptions) => {
                    isModifierFormDirty.current = true;
                    return onChange(selectedOptions);
                  }}
                  renderInput={(params) => (
                    <AvoTextField {...params} label="Automatically Add to:" />
                  )}
                />
              );
            }}
          />
        </Grid>
        <Grid item>
          <InputTooltip />
        </Grid>
      </Grid>
    );
  };

  const handleModItemPriorityChanged = (newModItemList) => {
    sortedModItemList = newModItemList;
  };

  const ModifierList = () => {
    return (
      <ModifierContainer
        onModifierItemClick={handleClickViewModifierItem}
        modifiersItems={modifierItemList}
        onModItemPriorityChanged={handleModItemPriorityChanged}
      />
    );
  };

  const ChildModal = () => {
    return (
      <React.Fragment>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          style={{ overflow: "scroll" }}
        >
          <Box>
            <IconButton
              className={`${styles["drawer-close-btn"]}`}
              onClick={() => {
                setOpen(false);
              }}
            >
              <ClearIcon className={`${styles["drawer-close-icon"]}`} />
            </IconButton>
            <DrawerContent />
          </Box>
        </Modal>
      </React.Fragment>
    );
  };

  const handleDeleteModifierItem = async (id) => {
    await deleteModifierItem({ id });
    setIsDeleteModModalOpen(false);
    // closeNewItemModal();
  };

  const DeleteModifierModal = () => {
    return (
      <>
        <Modal open={isDeleteModModalOpen}>
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
                  setIsDeleteModModalOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography className="title" textAlign="center">
                Delete Option?
              </Typography>
            </Grid>
            <Grid item className="mb-2">
              <Typography
                textAlign="center"
                fontSize="16px"
                color="black"
                fontWeight={400}
              >
                Are you sure you want to delete
                <Typography component="span" color="#F44336">
                  {" "}
                  {currentModifierName}{" "}
                </Typography>
                as an option?
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
                    setisAddItemModalOpen(false);
                    setIsDeleteModModalOpen(false);
                  }}
                >
                  {STRING.CANCEL}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() =>
                    handleDeleteModifierItem(currentModifierItemId)
                  }
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

  const AddItemCategoryButton = () => {
    return (
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        paddingTop="10px"
        style={{
          paddingTop: "0px",
        }}
      >
        <Button
          variant="text"
          onClick={() => {
            setisAddItemModalOpen(true);
          }}
        >
          New Item Category
        </Button>
      </Grid>
    );
  };

  const SwitchContainer = () => {
    return (
      <Grid item>
        <Card className={`${styles["card-1"]}`}>
          <CardContent>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                {availability.items.map((switchItem) => {
                  return (
                    <React.Fragment key={switchItem.label}>
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
                                    isModifierFormDirty.current = true;
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
                    </React.Fragment>
                  );
                })}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
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
              <ModifierNameSection />
              <RequiredSection />
              <Divider className={`${styles["divider"]}`} />
              <TypeOfModiferGroupSection />
              <SelectCheckBoxOption />
              <AddItemCategoryButton />
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const ModifierListCard = () => {
    return (
      <>
        <Grid item xs={2}>
          <ModifierList />
          {currentModifierID > 0 ? (
            <Button
              className={`${styles["btn-add-modifier"]}`}
              variant="contained"
              fullWidth
              onClick={() => {
                setIsDeleteModModalOpen(false);
                resetModifierItem();
                setOpen(true);
              }}
              startIcon={<AddCircleIcon />}
            >
              Add Option
            </Button>
          ) : (
            <Typography variant="h4" textAlign="center">
              Please save the mod group first to add the modifier items
            </Typography>
          )}
        </Grid>
        <ChildModal />
        <AddCategoryModal
          open={isAddItemModalOpen}
          modalTitle="New Item Category"
          toggleModal={setisAddItemModalOpen}
          restaurantId={restaurantId}
        />
        <DeleteModifierModal />
      </>
    );
  };

  const handleClickViewModifier = (modifierGroupAndItemData) => {
    setcurrentModifierID(modifierGroupAndItemData.id);
    sethasExistingModifierItems(
      !isEmpty(modifierGroupAndItemData.modifier_item)
    );
    // When edit mode is true -- send the request to update, otherwise, create.
    setcurrentEditingItem(modifierGroupAndItemData.name);
    setisEditMode(true);
    setShowNewItemModal(true); // open the dialog
    const { modifier_item, ...modifierGroup } = modifierGroupAndItemData;
    setModifierItemList(modifier_item);
    // Auto fill out fields after opening.
    Object.keys(modifierGroup).map((key) => {
      const value = modifierGroup[key];
      if (key === "is_required") {
        setValue(key, +value);
      } else if (key === "category") {
        setValue("category_ids", value);
      } else {
        setValue(key, value);
      }
    });
  };

  const handleClickViewModifierItem = (modifierItemdata) => {
    setisDeleteOptionVisible(true);
    setOpen(true);
    const { id, created_at, deleted_at, updated_at, ...data } =
      modifierItemdata;
    setCurrentModifierItemId(id);
    setcurrentModifierName(data.name);
    Object.keys(data).map((key) => {
      const value = data[key];
      if (key === "is_active") {
        setValueModifierItem(key, +value);
      } else if (key == "temperature_id") {
        const temperatureId = value; // temperature_id
        if (!isEmpty(data["temperature"])) {
          const finalValue = find(data["temperature"], { id: temperatureId });
          const { id, name } = finalValue;
          const temp_object = find(temperatureData, { name });
          const temperature_item = temp_object.temperature_item;
          const temperatureObject = {
            id,
            name,
            temperature_item,
          };
          setValueModifierItem(key, temperatureObject);
        }
      } else {
        setValueModifierItem(key, value);
      }
    });
  };

  const getDataToDisplayInCard = (foodItems, updatedAt) => {
    return [
      {
        label: "Mods",
        value: size(foodItems),
      },
      {
        label: "Last Edited",
        value: updatedAt,
      },
    ];
  };

  const ModifierItems = () => {
    return modifiers.map((modifierItem) => {
      const lastModUpdatedDateTime = getLastUpdatedDateTimeFrmArr([modifierItem])
      return (
        <Grid item key={modifierItem.id}>
          <AvoModifierCard
            {...modifierItem}
            items={getDataToDisplayInCard(modifierItem.modifier_item, lastModUpdatedDateTime)}
            onClick={() => handleClickViewModifier(modifierItem)}
          />
        </Grid>
      );
    });
  };

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

        <DialogContent dividers className={`${styles["dialog-content"]}`}>
          <Grid
            container
            direction="row"
            spacing={2}
            display="grid"
            gridTemplateColumns="1fr 3fr"
          >
            <form
              id="modifier-group"
              onSubmit={handleSubmit(onSubmit)}
              style={{ marginTop: 24 }}
            >
              <Grid item container direction="column" spacing={2}>
                <SwitchContainer />
                <BasicInformationCard />
              </Grid>
            </form>

            <Grid item container direction="column">
              <ModifierListCard />
            </Grid>
          </Grid>
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
              {STRING.ADD_MODIFIER_GROUP}
            </Button>
          </Grid>
        </Grid>

        <Grid container item direction="row" spacing={2}>
          <ModifierItems />
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

export default Modifiers;
