import React from "react";
import AvoTextField from "../AvoTextField";

const LocationAddress = React.forwardRef(
  ({ type, placeholder, ...props }, ref) => {
    return (
      <AvoTextField
        className="mt-1"
        type="text"
        fullWidth
        variant="outlined"
        label="Location Address"
        placeholder="Location Address"
        ref={ref}
        {...props}
      />
    );
  }
);

export default LocationAddress;
