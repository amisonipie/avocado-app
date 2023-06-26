import React from "react";
import { useSelector } from "react-redux";
import Loading from "../../Loading";

const LandingLayout = ({ children }) => {
  const isPageLoading = useSelector((state) => {
    return state.page.isPageLoading;
  });
  return <div>{isPageLoading ? <Loading /> : children}</div>;
};

export default LandingLayout;
