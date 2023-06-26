import React from "react";
import { FIELD } from "../../../lib/constants";
import AvoTextField from "../AvoTextField";

const OTP = React.forwardRef(({ ...props }, ref) => {
  return (
    <AvoTextField
      fullWidth
      variant="outlined"
      margin="normal"
      label={FIELD.OTP.LABEL}
      placeholder={FIELD.OTP.PLACEHOLDER}
      ref={ref}
      {...props}
    />
  );
});

export default OTP;
