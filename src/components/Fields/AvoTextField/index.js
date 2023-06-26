import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const AvoTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root.Mui-focused": {
    color: theme.palette.green["900"],
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: theme.palette.error.main,
  },
}));

export default AvoTextField;
