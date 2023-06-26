import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSelector } from "react-redux";
import AvoAlert from "../../AvoAlert";
import styles from "./AuthLayout.module.css";
const AuthLayout = (props) => {
  const alertConfig = useSelector((state) => {
    return state.alert;
  });
  return (
    <Grid
      container
      className={`${styles["container"]}`}
      direction="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Grid item>
        <Card className={`${styles["card"]}`}>
          <CardContent>{props.children}</CardContent>
        </Card>
      </Grid>
      {alertConfig.isOpen && <AvoAlert />}
    </Grid>
  );
};

export default AuthLayout;
