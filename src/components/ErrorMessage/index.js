import { Typography } from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    !isEmpty(message) && (
      <Typography variant="subtitle2" color="#d32f2f" gutterBottom>
        {message}
      </Typography>
    )
  );
};

export default ErrorMessage;
