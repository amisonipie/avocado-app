import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button, Grid, Typography } from "@mui/material";
import { isEmpty, size } from "lodash";
import { getCsrfToken } from "next-auth/react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AddCategoryModal from "../../../../../components/AddCategoryModal";
import AvoBreadcrumbs from "../../../../../components/AvoBreadcrumbs";
import ManagerLayout from "../../../../../components/Layout/Manager";
import AvoCategoryCard from "../../../../../components/Manager/Location/Menu/AvoCategoryCard";
import { setupInterceptors } from "../../../../../interceptors/axiosinterceptor";
import { LINKS, STRING } from "../../../../../lib/constants";
import { getLastUpdatedDateTimeFrmArr } from "../../../../../lib/utils";
import { useGetCategoryListQuery } from "../../../../api/category/categoryApi";
import { requireAuthentication } from "../../../../api/util/requireAuthentication";
import styles from "./categories.module.css";

const breadcrumbs = {
  items: [
    {
      text: STRING.MENU,
      url: LINKS.LOCATION_MENU,
    },
    {
      text: STRING.CATEGORIES,
    },
  ],
};
export const Categories = (props) => {
  useEffect(() => {
    const { accessToken } = props.session;
    if (accessToken) {
      setupInterceptors(accessToken);
    }
  }, [props]);

  const [open, setOpen] = React.useState(false);

  const { children, onClose, ...other } = props;

  const restaurantId = useSelector((state) => {
    return state.restaurant.restaurantId;
  });

  const {
    data: categoriesData,
    isLoading,
    refetch: refetchCategories,
  } = useGetCategoryListQuery({
    restaurantId,
  });

  const categories = categoriesData && categoriesData.result.data.categories;

  const getDataToDisplayInCard = (foodItems, updatedAt) => {
    return [
      {
        label: "Items",
        value: size(foodItems),
      },
      {
        label: "Last Edited",
        value: updatedAt,
      },
    ];
  };

  const CategoryItems = () => {
    if (!isEmpty(categories)) {
      return (
        categories &&
        categories.map(({ food_items, ...rest }) => {
          console.log(food_items)
          const lastCatUpdatedDateTime = getLastUpdatedDateTimeFrmArr(food_items)

          const categoryDetail = {
            ...rest,
            items: getDataToDisplayInCard(food_items, lastCatUpdatedDateTime),
          };
          return (
            <Grid item key={categoryDetail.id}>
              <AvoCategoryCard {...categoryDetail} />
            </Grid>
          );
        })
      );
    }
    return <Typography textAlign="center">No Categories Listed Yet</Typography>;
  };

  useEffect(() => {
    refetchCategories();
  }, []);

  return (
    <ManagerLayout enableMenuBar={true} isLoading={isLoading}>
      <AddCategoryModal
        open={open}
        modalTitle={STRING.NEW_CATEGORY_NAME}
        toggleModal={setOpen}
        restaurantId={restaurantId}
      />
      <Grid container direction="column">
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          className="mb-1 header-top"
        >
          <Grid item>
            <AvoBreadcrumbs {...breadcrumbs} />
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => setOpen(true)}
              className={styles["add-category-button"]}
            >
              {STRING.ADD_CATEGORY}
            </Button>
          </Grid>
        </Grid>

        <Grid item container direction="row" spacing={2}>
          <CategoryItems />
        </Grid>
      </Grid>
    </ManagerLayout>
  );
};

export async function getServerSideProps(context) {
  const csrfToken = (await getCsrfToken(context)) || null;
  return requireAuthentication(context, ({ session }) => {
    return {
      props: { session, csrfToken },
    };
  });
}

export default Categories;
