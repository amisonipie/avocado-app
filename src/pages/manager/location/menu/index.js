import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoriesIcon from "../../../../components/Icon/CategoriesIcon";
import ModifiersIcon from "../../../../components/Icon/ModifiersIcon";
import ManagerLayout from "../../../../components/Layout/Manager";
import AvailibilityCard from "../../../../components/Manager/Location/Menu/AvailibilityCard";
import AvoCard from "../../../../components/Manager/Location/Menu/AvoCard";
import { setupInterceptors } from "../../../../interceptors/axiosinterceptor";
import { LINKS, STRING } from "../../../../lib/constants";
import { getLastUpdatedDateTimeFrmArr } from "../../../../lib/utils";
import { useGetCategoryListQuery } from "../../../api/category/categoryApi";
import { useGetModifierListQuery } from "../../../api/modifier/modifierApi";
import { requireAuthentication } from "../../../api/util/requireAuthentication";

export const Menu = (props) => {
  useEffect(() => {
    const { accessToken } = props.session;
    if (accessToken) {
      setupInterceptors(accessToken);
    }
  }, [props]);
  const dispatch = useDispatch();
  const [totalCategories, setTotalCategories] = useState(0);
  const [categoriesUpdatedAt, setCategoriesUpdatedAt] = useState("-");
  const [totalModifiers, setTotalModifiers] = useState(0);
  const [modifiersUpdatedAt, setModifiersUpdatedAt] = useState("-");
  const [isLoading, setIsLoading] = useState(false);

  const restaurantId = useSelector((state) => {
    return state.restaurant.restaurantId;
  });

  const { data: categoriesData, isLoading: isGetCategoryListLoading } =
    useGetCategoryListQuery({
      restaurantId,
    });

  const { data: modifiersData, isLoading: isGetModifierListLoading } =
    useGetModifierListQuery({
      restaurantId,
    });

  useEffect(() => {
    if (categoriesData && categoriesData.result.success) {
      if (categoriesData.result.data.pagination) {
        const value = categoriesData.result.data.pagination.records.total;
        setTotalCategories(value);
      } else if (categoriesData.result.data) {
        const length = categoriesData.result.data.categories.length;
        setTotalCategories(length);
      }
      const lastCatUpdatedDateTime = getLastUpdatedDateTimeFrmArr(categoriesData.result.data.categories)
      setCategoriesUpdatedAt(lastCatUpdatedDateTime)
    }
  }, [categoriesData]);

  useEffect(() => {
    if (modifiersData && modifiersData.success) {
      if (modifiersData.data.pagination) {
        const value = modifiersData.data.pagination.records.total;
        setTotalModifiers(value);
      } else if (modifiersData.data) {
        const length = modifiersData.data.modifier.length;
        setTotalModifiers(length);
      }
      const lastModUpdatedDateTime = getLastUpdatedDateTimeFrmArr(modifiersData.data.modifier)
      setModifiersUpdatedAt(lastModUpdatedDateTime)
    }
  }, [modifiersData]);

  const categories = {
    icon: <CategoriesIcon />,
    title: "Categories",
    items: [
      {
        key: "Categories",
        value: totalCategories,
      },
      {
        key: "Last Edited",
        value: categoriesUpdatedAt,
      },
    ],
    link: {
      url: LINKS.MENU_CATEGORIES,
      text: STRING.VIEW_CATEGORIES,
    },
  };

  const modifiers = {
    icon: <ModifiersIcon />,
    title: "Modifiers",
    items: [
      {
        key: "Modifiers",
        value: totalModifiers,
      },
      {
        key: "Last Edited",
        value: modifiersUpdatedAt,
      },
    ],
    link: {
      url: LINKS.MENU_MODIFIERS,
      text: STRING.VIEW_MODIFIERS,
    },
  };

  useEffect(() => {
    setIsLoading(
      isGetCategoryListLoading === true || isGetModifierListLoading === true
    );
  }, [isGetCategoryListLoading, isGetModifierListLoading]);

  return (
    <>
      <ManagerLayout enableMenuBar={true} isLoading={isLoading}>
        <Grid container direction="column">
          <Grid item>
            <Typography
              className="title"
              textAlign="left !important"
              fontSize="48px !important"
              marginBottom="36px !important"
              marginTop="16px !important"
            >
              {STRING.MENU}
            </Typography>
          </Grid>
          <Grid item container direction="row" spacing={2}>
            <Grid item>
              <AvoCard {...categories} />
            </Grid>
            <Grid item>
              <AvoCard {...modifiers} />
            </Grid>
            <Grid item>
              <AvailibilityCard setIsLoading={setIsLoading} />
            </Grid>
          </Grid>
        </Grid>
      </ManagerLayout>
    </>
  );
};

export async function getServerSideProps(context) {
  return requireAuthentication(context, ({ session }) => {
    return {
      props: { session },
    };
  });
}

export default Menu;
