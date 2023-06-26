import SvgIcon from "@mui/material/SvgIcon";
import * as React from "react";

function ReportIcon(props) {
  return (
    <SvgIcon
      width="15"
      height="20"
      viewBox="0 0 15 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 0V5H15L10 0Z" fill="#9FBF3B80" />
      <path
        d="M10 6.25C9.31125 6.25 8.75 5.68875 8.75 5V0H1.25C0.56125 0 0 0.56125 0 1.25V18.75C0 19.44 0.56125 20 1.25 20H13.75C14.44 20 15 19.44 15 18.75V6.25H10ZM5 17.5H2.5V13.75H5V17.5ZM8.75 17.5H6.25V11.25H8.75V17.5ZM12.5 17.5H10V8.75H12.5V17.5Z"
        fill="#9FBF3B80"
      />
    </SvgIcon>
  );
}

export default ReportIcon;
