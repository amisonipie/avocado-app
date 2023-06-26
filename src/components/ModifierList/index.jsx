import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { ListItem, ListItemText, Typography } from "@mui/material";
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "../../../styles/Modifiers.module.css";

const MODIFIER_ITEM_LIST = "MODIFIER_ITEM_LIST";

const ModifierList = ({
  id,
  text,
  index,
  moveModifierItem,
  onModifierItemClick,
  data,
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: MODIFIER_ITEM_LIST,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveModifierItem(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: MODIFIER_ITEM_LIST,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  return (
    <ListItem
      className={`${styles["list-item"]}`}
      divider
      onClick={() => {
        onModifierItemClick(data);
      }}
      ref={ref}
      style={{
        opacity: isDragging ? 0 : 1,
      }}
    >
      <ListItemText className={`${styles["dialog-card-title"]}`}>
        <Typography component="span" display="flex" gap="10px">
          <MenuIcon />
          <Typography fontWeight="fontWeightBold">{text}</Typography>
          <ChevronRightIcon sx={{ marginLeft: "auto" }} />
        </Typography>
      </ListItemText>
    </ListItem>
  );
};

export default ModifierList;
