import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { FIELD } from "../../../lib/constants";
import AvoTextField from "../AvoTextField";

const Password = React.forwardRef(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AvoTextField
      type={showPassword ? "text" : "password"}
      fullWidth
      variant="outlined"
      margin="normal"
      label={FIELD.PASSWORD.LABEL}
      placeholder={FIELD.PASSWORD.PLACEHOLDER}
      ref={ref}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      autoComplete="off"
      {...props}
    />
  );
});

export default Password;
