import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./AvailibilityCard.module.css";

import { STRING } from "../../../../../lib/constants";
import {
  useGetRestaurantDetailQuery,
  useUpdateRestaurantDetailMutation,
} from "../../../../../pages/api/restaurant/restaurantApi";
import AvoSwitch from "../../../../Switch";

const availability = {
  items: [
    {
      label: "POS",
      labelPlacement: "top",
    },
    {
      label: "Pickup",
      labelPlacement: "top",
    },
    {
      label: "Delivery",
      labelPlacement: "top",
    },
  ],
};

const AvailibilityCard = React.forwardRef(({ ...props }, ref) => {
  const { setIsLoading } = props;
  const restaurantId = useSelector((state) => {
    return state.restaurant.restaurantId;
  });
  const {
    data: restaurantData,
    isLoading: isGetRestaurantDetailLoading,
    refetch: refetchGetRestaurantDetail,
  } = useGetRestaurantDetailQuery({
    id: restaurantId,
  });

  const [
    updateRestaurantDetail,
    {
      isSuccess: isUpdateRestaurantDetailSuccess,
      isLoading: isUpdateRestaurantDetailLoading,
    },
  ] = useUpdateRestaurantDetailMutation();

  const [restaurantOptions, setRestaurantOptions] = useState();

  useEffect(() => {
    if (restaurantData) {
      const { restaurant } = restaurantData;
      const { pos, pickup, delivery } = restaurant;
      setRestaurantOptions({
        pos: Boolean(pos),
        pickup: Boolean(pickup),
        delivery: Boolean(delivery),
      });
    }
  }, [restaurantData]);

  useEffect(() => {
    setIsLoading(
      isUpdateRestaurantDetailLoading || isGetRestaurantDetailLoading
    );
    // eslint-why will cause unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateRestaurantDetailLoading, isGetRestaurantDetailLoading]);

  useEffect(() => {
    if (isUpdateRestaurantDetailSuccess) {
      refetchGetRestaurantDetail();
    }
    // eslint-why will cause unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateRestaurantDetailSuccess]);

  const handleToggleSwitch = async (e) => {
    const request = {
      [e.target.name]: +e.target.checked,
    };
    const newOptions = {
      ...restaurantOptions,
      [e.target.name]: e.target.checked,
    };
    setRestaurantOptions(newOptions);
    await updateRestaurantDetail({ id: restaurantId, ...request });
  };

  return (
    <Card className={`${styles["card"]}`}>
      <CardHeader
        className="card-header"
        title={
          <Typography className="card-title">{STRING.AVAILABILITY}</Typography>
        }
      />
      <CardContent>
        <Grid container direction="row">
          {!isEmpty(restaurantOptions) &&
            availability.items.map((switchItem) => {
              return (
                <React.Fragment key={switchItem.label}>
                  <FormControlLabel
                    control={
                      <AvoSwitch
                        disabled={switchItem.label.toLowerCase() === "pos"}
                        name={switchItem.label.toLowerCase()}
                        onChange={handleToggleSwitch}
                        defaultChecked={
                          restaurantOptions[switchItem.label.toLowerCase()]
                        }
                      />
                    }
                    label={switchItem.label}
                    labelPlacement={switchItem.labelPlacement}
                  />
                </React.Fragment>
              );
            })}
        </Grid>
      </CardContent>
    </Card>
  );
});

export default AvailibilityCard;
