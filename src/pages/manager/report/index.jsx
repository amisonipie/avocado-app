import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import TooltipIcon from "../../../components/Icon/TooltipIcon";
import ManagerLayout from "../../../components/Layout/Manager";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import AvoTextField from "../../../components/Fields/AvoTextField";
import { SEVERITY } from "../../../lib/constants";
import { showAlert } from "../../../store/slice/alertSlice";
import { useSendReportMutation } from "../../api/reports/reportApi";
import { requireAuthentication } from "../../api/util/requireAuthentication";
const adapter = new AdapterDateFns();

const InputTooltip = () => {
  return (
    <Tooltip title="This is a Tooltip" placement="top">
      <IconButton>
        <TooltipIcon />
      </IconButton>
    </Tooltip>
  );
};

const Report = ({ session }) => {
  const dispatch = useDispatch();
  const [endDate, setEndDate] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [reportType, setReportType] = React.useState("sales_data");
  const [sendReport, { isSuccess: isSendReportSuccess }] =
    useSendReportMutation();
  const restauantId = useSelector((state) => {
    return state.restaurant.restaurantId;
  });

  const StartDatePicker = () => {
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        localeText={{ start: "Start Date" }}
      >
        <DatePicker
          inputFormat="yyyy/MM/dd"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(moment(newValue).format("YYYY-MM-DD"));
          }}
          renderInput={(inputProps) => {
            return <AvoTextField {...inputProps} />;
          }}
        />
      </LocalizationProvider>
    );
  };

  const EndDatePicker = () => {
    return (
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        localeText={{ end: "End Date" }}
      >
        <DatePicker
          inputFormat="yyyy/MM/dd"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(moment(newValue).format("YYYY-MM-DD"));
          }}
          renderInput={(inputProps) => {
            return <AvoTextField {...inputProps} />;
          }}
        />
      </LocalizationProvider>
    );
  };

  const RangePickers = () => {
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <StartDatePicker />
        <Typography>To</Typography>
        <EndDatePicker />
      </Stack>
    );
  };

  const handleSendReports = async () => {
    await sendReport({
      start_at: startDate,
      end_at: endDate,
      restaurant_id: restauantId,
      type: reportType,
    });
  };

  const isButtonDisabled = () => {
    return (
      endDate === null ||
      startDate === null ||
      moment(endDate).isBefore(startDate)
    );
  };

  useEffect(() => {
    if (isSendReportSuccess) {
      dispatch(
        showAlert({
          severity: SEVERITY.SUCCESS,
          text: "Your report has been successfuly sent!",
        })
      );
    }
  }, [isSendReportSuccess]);

  return (
    <ManagerLayout enableMenuBar={true}>
      <Grid container direction="column">
        <Grid item>
          <Typography
            className="title"
            textAlign="left !important"
            fontSize="48px !important"
            marginBottom="36px !important"
            marginTop="15px !important"
          >
            Reports
          </Typography>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            paddingTop: "50px",
            paddingBottom: "50px",
            paddingRight: "25px",
            paddingLeft: "50px",
          }}
        >
          <Grid
            item
            container
            direction="row"
            spacing={2}
            display="grid"
            gridTemplateColumns="1fr 2fr"
          >
            <Grid
              item
              container
              direction="row"
              display="grid"
              gridTemplateColumns="5fr 1fr"
              alignItems="center"
            >
              <Grid item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Report Type
                  </InputLabel>
                  <Select
                    label="Report Type"
                    onChange={(e) => {
                      setReportType(e.target.value);
                    }}
                  >
                    <MenuItem value="sales_data">Sales Data</MenuItem>
                    <MenuItem value="driver_tips">Driver Tips</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <InputTooltip />
              </Grid>
            </Grid>

            <Grid
              item
              container
              display="grid"
              gridTemplateColumns="5fr 1fr"
              gap="20px"
              alignItems="center"
            >
              <Grid item>
                <RangePickers />
              </Grid>
              <Grid item>
                <Button
                  sx={{
                    color: "black",
                  }}
                  variant="contained"
                  onClick={handleSendReports}
                  disabled={isButtonDisabled()}
                >
                  Run Report
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </ManagerLayout>
  );
};

export async function getServerSideProps(context) {
  return requireAuthentication(context, ({ session }) => {
    return {
      props: { session },
    };
  });
}

export default Report;
