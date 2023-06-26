import FilledIcon from "@mui/icons-material/Star";
import NotFilledIcon from "@mui/icons-material/StarBorder";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import * as React from "react";
import { Controller } from "react-hook-form";
import styles from "../../../styles/AvoAutoComplete.module.css";
import { FIELD } from "../../lib/constants";
import AvoTextField from "../Fields/AvoTextField";
const AvoAutoComplete = ({
  items,
  control,
  isModifierItemFormDirtyRef,
  options,
  name,
  label,
}) => {
  const [value, setValue] = React.useState(null);
  const [itemTest, setItemTest] = React.useState(null);
  const [temperatureItems, setTemperatureItems] = React.useState([]);

  const StarFavoriteIcon = (props) => {
    return (
      <Radio
        sx={{
          "&:hover": {
            bgcolor: "transparent",
          },
        }}
        disableRipple
        color="default"
        checkedIcon={<FilledIcon htmlColor="#FFC107" />}
        icon={<NotFilledIcon />}
        {...props}
      />
    );
  };

  const MeatSetting = () => {
    return (
      <FormControl className={`${styles["form-control"]}`}>
        <Controller
          rules={{ required: true }}
          control={control}
          name="temperature_item_id"
          render={({ field: { onChange, ...rest } }) => (
            <RadioGroup
              {...rest}
              onChange={(event, item) => {
                isModifierItemFormDirtyRef.current = true;
                onChange(item);
              }}
            >
              {temperatureItems.map((setting) => {
                return (
                  <FormControlLabel
                    key={setting.id}
                    value={setting.id}
                    control={<StarFavoriteIcon />}
                    label={setting.name}
                  />
                );
              })}
            </RadioGroup>
          )}
        />
      </FormControl>
    );
  };

  const EggSetting = () => {
    return (
      <FormControl className={`${styles["form-control"]}`}>
        <Controller
          rules={{ required: true }}
          control={control}
          name="temperature_item_id"
          render={({ field: { onChange, ...rest } }) => (
            <RadioGroup
              {...rest}
              onChange={(event, item) => {
                isModifierItemFormDirtyRef.current = true;
                onChange(item);
              }}
            >
              {temperatureItems.map((setting) => {
                return (
                  <FormControlLabel
                    key={setting.id}
                    value={setting.id}
                    control={<StarFavoriteIcon />}
                    label={setting.name}
                  />
                );
              })}
            </RadioGroup>
          )}
        />
      </FormControl>
    );
  };

  const AdditionalTemperatureSetting = () => {
    if (value === "Eggs") return <EggSetting />;
    if (value === "Meat") return <MeatSetting />;
    if (value === null) return <></>;
  };

  return (
    <>
      <Controller
        name="temperature_id"
        control={control}
        render={({ field: { onChange, value } }) => {
          if (value) {
            setValue(value.name);
            setTemperatureItems(value.temperature_item);
          }
          return (
            <Autocomplete
              disablePortal
              onChange={(event, item) => {
                isModifierItemFormDirtyRef.current = true;
                onChange(item);
                if (item) {
                  setValue(item.name);
                  setTemperatureItems(item.temperature_item);
                } else {
                  setValue(null);
                }
              }}
              value={value}
              options={items}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <AvoTextField
                  {...params}
                  label={FIELD.TEMPERATURE_SETTINGS.LABEL}
                  name={FIELD.TEMPERATURE_SETTINGS.LABEL}
                  placeholder={FIELD.TEMPERATURE_SETTINGS.PLACEHOLDER}
                  value={params.id}
                />
              )}
            />
          );
        }}
      />
      <Box display="flex" alignItems="center">
        <AdditionalTemperatureSetting />
      </Box>
    </>
  );
};

export default AvoAutoComplete;
