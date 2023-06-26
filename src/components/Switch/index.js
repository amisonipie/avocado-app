import styled from "@emotion/styled";
import Switch from "@mui/material/Switch";

const AvoSwitch = styled(Switch)(({ theme }) => ({
  width: 65,
  height: 40,
  padding: 5,
  margin: 2,
  display: "flex",
  color: "#777777",
  "& .MuiSwitch-switchBase": {
    backgroundColor: "transparent",
    color: "#9F9F9F",
    "&.Mui-checked": {
      color: "#9FBF3B",
      marginLeft: 4,
      backgroundColor: "transparent",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "transparent",
        border: "2px solid #777777",
      },
    },

    "&:before": {
      color: "red",
    },
  },
  ".MuiSwitch-track": {
    backgroundColor: "#fff",
    border: "2px solid #777777",
    opacity: "1",
  },
  "& .MuiSwitch-track": {
    borderRadius: 15,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      color: "red",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      content: '"ON"',
      fontSize: 10,
      color: "#777777",
      left: 10,
      top: 22,
      fontWeight: 900,
    },
    "&:after": {
      display: "flex",
      content: '"OFF"',
      fontSize: 10,
      textAlign: "center",
      color: "#777777",
      right: 16,
      top: 22,
      fontWeight: 900,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 23,
    height: 23,
    margin: 0,
    "&:before": {
      color: "red",
    },
    "&:after": {},
  },
}));

export default AvoSwitch;
