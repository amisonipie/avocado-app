import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Typography } from "@mui/material";
import { isNil } from "lodash";
import Link from "next/link";
import React from "react";
import { truncateText } from "../../lib/utils";

const AvoBreadcrumbs = React.forwardRef(({ ...props }) => {
  const items = props.items;
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="medium" />}
    >
      {Object.keys(items).map((index) => {
        var item = items[index];
        if (index < props.items.length - 1) {
          return (
            <Typography
              className="breadcrumbs-prev opacity-5"
              fontSize="48px !important"
            >
              {!isNil(item.onClick) ? (
                <Link href="#">
                  <a onClick={item.onClick}>{item.text}</a>
                </Link>
              ) : (
                <Link href={item.url} passHref>
                  {item.text}
                </Link>
              )}
            </Typography>
          );
        } else {
          return (
            <Typography
              className="breadcrumbs-current"
              fontSize="48px !important"
            >
              {truncateText(item.text, 6)}
            </Typography>
          );
        }
      })}
    </Breadcrumbs>
  );
});

export default AvoBreadcrumbs;
