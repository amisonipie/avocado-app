import { Button } from "@mui/material";

const Submit = (props) => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      sx={{
        maxHeight: "70px",
        minHeight: "55px",
        textDecoration: "none",
      }}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default Submit;
