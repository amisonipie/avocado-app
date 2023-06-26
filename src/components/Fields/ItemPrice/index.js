import PropTypes from "prop-types";
import React from "react";
import NumberFormat from "react-number-format";
import AvoTextField from "../AvoTextField";

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
});

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
const ItemPrice = React.forwardRef(({ type, placeholder, ...props }, ref) => {
  const [values, setValues] = React.useState({});

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <AvoTextField
      label="Item Price"
      value={values.numberformat}
      onChange={handleChange}
      name="numberformat"
      id="Item Price"
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
      fullWidth
      variant="outlined"
      ref={ref}
      {...props}
    />
  );
});

export default ItemPrice;
