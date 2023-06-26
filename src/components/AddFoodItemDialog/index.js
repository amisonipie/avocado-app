import { Dialog, Slide } from "@mui/material";
import React from "react";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const AddFoodItemDialog = ({
  children,
  showNewItemModal,
  closeNewItemModal,
}) => {
  return (
    <Dialog
      fullScreen
      open={showNewItemModal}
      onClose={closeNewItemModal}
      TransitionComponent={Transition}
    >
      {children}
    </Dialog>
  );
};

export default AddFoodItemDialog;
