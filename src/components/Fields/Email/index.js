import React from "react";
import { FIELD } from "../../../lib/constants";
import AvoTextField from "../AvoTextField";

const Email = React.forwardRef(({ ...props }, ref) => {
  return (
    <AvoTextField
      type="email"
      fullWidth
      variant="outlined"
      margin="normal"
      label={FIELD.EMAIL.LABEL}
      placeholder={FIELD.EMAIL.PLACEHOLDER}
      ref={ref}
      {...props}
    />
  );
});

export default Email;
