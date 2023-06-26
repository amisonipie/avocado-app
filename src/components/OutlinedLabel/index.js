import { TextField } from "@mui/material";
import React from "react";

const InputComponent = ({ inputRef, ...other }) => <div {...other} />;
const OutlinedLabel = ({ children, label }) => {
  return (
    <TextField
      variant="outlined"
      label={label}
      multiline
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: InputComponent,
      }}
      inputProps={{ children: children }}
      fullWidth
    />
  );
};
export default OutlinedLabel;
