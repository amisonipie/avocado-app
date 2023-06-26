import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";

const Loading = ({ open = true }) => {
  return (
    <Backdrop sx={{ color: "#fff", zIndex: 1 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
