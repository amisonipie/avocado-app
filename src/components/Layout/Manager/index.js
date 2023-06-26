import { Grid } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import AvoAppBar from "../../../components/AvoAppBar";
import AvoMenuBar from "../../../components/Manager/AvoMenuBar";
import { DRAWER_WIDTH } from "../../../lib/constants";
import AvoAlert from "../../AvoAlert";
import Loading from "../../Loading";

const ManagerLayout = ({ children, isLoading, enableMenuBar }) => {
  const [showMobileMenuBar, setShowMobileMenuBar] = useState(false);
  const alertConfig = useSelector((state) => {
    return state.alert;
  });
  return (
    <>
      {isLoading && <Loading />}
      <Grid container direction="column">
        <Grid item>
          <AvoAppBar
            toggleMobileMenuBar={() => {
              setShowMobileMenuBar(!showMobileMenuBar);
            }}
          />
        </Grid>
        {enableMenuBar ? (
          <AvoMenuBar showMobileMenuBar={showMobileMenuBar}>
            {children}
            {alertConfig.isOpen && <AvoAlert />}
          </AvoMenuBar>
        ) : (
          <Grid container item direction="row">
            <Grid item sx={{ width: DRAWER_WIDTH }}></Grid>
            <Grid item sx={{ flex: 1, padding: "25px 100px 25px 25px" }}>
              {children}
              {alertConfig.isOpen && <AvoAlert />}
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

ManagerLayout.defaultProps = {
  enableMenuBar: true,
};

export default ManagerLayout;
