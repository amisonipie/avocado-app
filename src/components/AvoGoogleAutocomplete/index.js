import { ClickAwayListener, Grid, TextField, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getZipCode,
} from "use-places-autocomplete";
import {
  getAddressComponent,
  placeAddressCompoponent,
} from "../../lib/utls/addressUtils";

const AvoGoogleAutocomplete = ({
  setAvoFormValue,
  setIsLocationAddressFieldDirty,
  defaultFormattedAddress,
  setisAddressFieldHasvalue,
}) => {
  const {
    value,
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });
  const [open, setopen] = useState(false);
  const handleInput = (e) => {
    setopen(true);
    setValue(e.target.value);
  };

  useEffect(() => {
    if (!isEmpty(defaultFormattedAddress)) {
      setValue(defaultFormattedAddress);
    }
  }, [defaultFormattedAddress]);

  const handleSelect = async ({ key }) => {
    setValue(key);
    setopen(false);
    clearSuggestions();

    const results = await getGeocode({ address: key });
    const latllong = await getLatLng(results[0]);
    const { address_components, formatted_address, place_id } = results[0];
    const addressRequest = {
      address: formatted_address,
      city: getAddressComponent(
        address_components,
        placeAddressCompoponent.CITY
      ),
      state: getAddressComponent(
        address_components,
        placeAddressCompoponent.STATE
      ),
      country: getAddressComponent(
        address_components,
        placeAddressCompoponent.COUNTRY
      ),
      zip_code: getZipCode(results[0], false),
      lat: latllong.lat,
      long: latllong.lng,
      formatted_address,
      place_id,
    };
    setIsLocationAddressFieldDirty(true);
    setisAddressFieldHasvalue(true);
    setAvoFormValue("address.details", addressRequest);
  };

  return (
    <ClickAwayListener onClickAway={() => clearSuggestions()}>
      <Autocomplete
        getOptionLabel={(option) => {
          return typeof option === "string" ? option : option.description;
        }}
        open={open}
        options={data}
        autoComplete
        includeInputInList
        filterSelectedOptions
        noOptionsText="No results"
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Location Address"
            variant="outlined"
            fullWidth
            onChange={(e) => handleInput(e)}
          />
        )}
        renderOption={(option) => {
          return (
            <Grid
              alignItems="center"
              onClick={() => {
                return handleSelect(option);
              }}
              className="MuiAutocomplete-option"
            >
              <Typography variant="body2" color="textSecondary">
                {option.key || ""}
              </Typography>
            </Grid>
          );
        }}
      />
    </ClickAwayListener>
  );
};

export default AvoGoogleAutocomplete;
