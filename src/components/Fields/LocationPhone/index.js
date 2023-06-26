import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";
import * as React from "react";
import { IMaskInput } from "react-imask";
import styles from "./LocationPhone.module.css";
const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#00) 000-0000"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

TextMaskCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const LocationPhone = React.forwardRef(
  ({ type, placeholder, ...props }, ref) => {
    const [values, setValues] = React.useState({});

    const handleChange = (event) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value,
      });
    };

    return (
      <FormControl fullWidth>
        <InputLabel className={`${styles["label"]}`}>Location Phone</InputLabel>
        <OutlinedInput
          className="mt-1"
          fullWidth
          label="Location Phone"
          variant="outlined"
          value={values.textmask}
          onChange={handleChange}
          name="textmask"
          id="formatted-text-mask-input"
          inputComponent={TextMaskCustom}
          ref={ref}
          {...props}
        />
      </FormControl>
    );
  }
);

export default LocationPhone;
