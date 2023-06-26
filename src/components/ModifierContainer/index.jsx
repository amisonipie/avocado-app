import { List } from "@mui/material";
import update from "immutability-helper";
import React, { useCallback, useEffect, useState } from "react";
import ModifierList from "../ModifierList";

const ModifierContainer = ({
  modifiersItems,
  onModifierItemClick,
  onModItemPriorityChanged,
}) => {
  const [modifiers, setmodifiers] = useState([]);

  useEffect(() => {
    setmodifiers(modifiersItems);
  }, [modifiersItems]);

  const moveModifierItem = useCallback((dragIndex, hoverIndex) => {
    setmodifiers((prevModifier) =>
      update(prevModifier, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevModifier[dragIndex]],
        ],
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-why will cause unnecessary re-renders
  }, []);

  useEffect(() => {
    if (
      Object.keys(modifiers).length > 0 &&
      onModItemPriorityChanged !== undefined &&
      modifiers !== modifiersItems
    ) {
      onModItemPriorityChanged(modifiers);
    }
  }, [modifiers]);

  const renderModifier = useCallback((modifierItem, index) => {
    return (
      <ModifierList
        key={modifierItem.id}
        index={index}
        id={modifierItem.id}
        text={modifierItem.name}
        moveModifierItem={moveModifierItem}
        onModifierItemClick={onModifierItemClick}
        data={modifierItem}
      />
    );
    // eslint-why will cause unnecessary re renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <List component="nav">
        {modifiers.map((item, i) => {
          return (
            <React.Fragment key={item.name}>
              {renderModifier(item, i)}
            </React.Fragment>
          );
        })}
      </List>
    </>
  );
};

export default ModifierContainer;
