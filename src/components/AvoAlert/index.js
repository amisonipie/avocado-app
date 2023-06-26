import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAlert } from "../../store/slice/alertSlice";

const ALERT_BG_COLOR = {
  success: "#2a672a",
  error: "#D40000",
};

const ALERT_TEXT_COLOR = {
  success: "#fff",
  error: "#fff",
};

const AvoAlert = () => {
  const dispatch = useDispatch();
  const alertConfig = useSelector((state) => {
    return state.alert;
  });

  return (
    <Snackbar
      open={alertConfig.isOpen}
      autoHideDuration={100000}
      onClose={() => {
        dispatch(closeAlert());
      }}
    >
      <Alert
        color={alertConfig.severity}
        style={{
          backgroundColor: ALERT_BG_COLOR[alertConfig.severity],
          color: ALERT_TEXT_COLOR[alertConfig.severity],
          position: "absolute",
          bottom: "30px",
          width: "max-content",
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              dispatch(closeAlert());
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        severity={alertConfig.severity}
      >
        {alertConfig.text}
      </Alert>
    </Snackbar>
  );
};

export default AvoAlert;
