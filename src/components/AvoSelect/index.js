import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { arrObjColumn } from "../../lib/utils";
import OutlinedLabel from "../OutlinedLabel";

const AvoSelect = React.forwardRef(({ ...props }) => {
  const [checked, setChecked] = React.useState([0]);
  const [selectAllEnabled, setSelectAllEnabled] = React.useState(false);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    let newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    if (value == "all-items") {
      newChecked = arrObjColumn(props.items, value);
    }

    setChecked(newChecked);
  };

  return (
    <>
      <OutlinedLabel label={props.label}>
        <List sx={{ width: "100%" }}>
          {Object.keys(props.items).map((index) => {
            var label = props.items[index]["label"];
            var value = props.items[index]["value"];

            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem key={value} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </OutlinedLabel>
    </>
  );
});

export default AvoSelect;
