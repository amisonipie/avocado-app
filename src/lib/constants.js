import HomeIcon from "@mui/icons-material/Home";
import LocationSettingIcon from "../components/Icon/LocationSetting";
import MenuIcon from "../components/Icon/MenuIcon";
import ReportIcon from "../components/Icon/ReportIcon";
import TeamMemberIcon from "../components/Icon/TeamMemberIcon";

export const APP_URL = "https://api.avocadodelivers.app/";

export const STRING = {
  APP_NAME: "Avocado",

  ADD_RESTAURANT: "Add Restaurant",
  RESTAURANT: "Restaurant",
  ADD_USER: "Add User",
  USER: "User",

  CATEGORIES: "Categories",
  VIEW_CATEGORIES: "View Categories",
  ADD_CATEGORY: "Add Category",
  NEW_CATEGORY_NAME: "New Category Name",
  VIEW_CATEGORY: "View Category",
  MODIFIERS: "Modifiers",
  VIEW_MODIFIERS: "View Modifiers",
  ADD_MODIFIER_GROUP: "Add Modifier Group",
  VIEW_MODIFIER_GROUP: "View Mod Group",
  VIEW_ITEM: "View Item",
  AVAILABILITY: "Availability",

  HOME: "Home",
  MENU: "Menu",
  ORDERS: "Orders",
  TEAM_MEMBERS: "Team Members",
  REPORTS: "Reports",
  LOCATION_SETTING: "Location Settings",
  USERS: "Users",

  CREATE: "Create",
  CANCEL: "Cancel",
  SAVE: "Save",
  TAGS: "Tags",
  ADD: "Add",
  DELETE: "Delete",

  LGN: {
    TITLE: "Remote Terminal Login",
    BTN: "Login",
    FRGT_PASS_TEXT: "Forgot Password",
    BACK_TO_LOGIN: "Go back to Login",
    RESEND_OTP: "Resend OTP",
  },

  FRGT_PASS: {
    TITLE: "Reset Password",
    SUBTITLE:
      "To reset your password, enter the email address associated with your account.",
    BTN: "Send Reset Link",
    LGN_TEXT: "Back to Login",
    RESET_TEXT: "Reset your password",
  },

  FRGT_SUCCESS: {
    TITLE: "Sent!",
    SUBTITLE:
      "A link has been sent to the address provided if an account with that address exists.",
  },

  RST_SUCCESS: {
    TITLE: "Your password has been reset successfully.",
    SUBTITLE: "Please login again your account.",
  },

  RST_PASS: {
    TITLE: "Create New Password",
    BTN: "Submit",
  },
};

export const FIELD = {
  OTP: {
    UNIQUE_NAME: "OTP",
    LABEL: "OTP",
    PLACEHOLDER: "Enter OTP",
  },
  EMAIL: {
    UNIQUE_NAME: "email",
    LABEL: "Email Address",
    PLACEHOLDER: "Enter your email",
  },
  PASSWORD: {
    UNIQUE_NAME: "password",
    LABEL: "Password",
    PLACEHOLDER: "Enter your Password",
  },
  RST_PASS: {
    UNIQUE_NAME: "resetPassword",
    LABEL: "Password",
    PLACEHOLDER: "Enter your new Password",
  },
  CNFRM_RST_PASS: {
    UNIQUE_NAME: "confirmResetPassword",
    LABEL: "Confirm Password",
    PLACEHOLDER: "Confirm New Password",
  },
  NEW_CATEGORY: {
    UNIQUE_NAME: "categoryName",
    LABEL: "Category Name",
    PLACEHOLDER: "Enter the category name",
  },
  ITEM_NAME: {
    UNIQUE_NAME: "itemName",
    LABEL: "Item Name",
    PLACEHOLDER: "Enter the item name",
  },
  ITEM_DESC: {
    UNIQUE_NAME: "itemDescription",
    LABEL: "Description",
    PLACEHOLDER: "Enter the item description",
  },
  ITEM_PRICE: {
    UNIQUE_NAME: "itemPrice",
    LABEL: "Price",
    PLACEHOLDER: "Enter the item price",
  },
  ITEM_FLAVOUR: {
    UNIQUE_NAME: "itemFlavour",
    LABEL: "Flavour Profile",
    PLACEHOLDER: "Enter the item flavour",
  },
  ITEM_RECOMMENDED: {
    UNIQUE_NAME: "itemRecommended",
    LABEL: "Staff Recommended?",
    PLACEHOLDER: "Enter the item recommended",
    OPTIONS: ["Yes", "No"],
  },
  ITEM_CATEGORY: {
    UNIQUE_NAME: "itemCategory",
    LABEL: "Category",
    PLACEHOLDER: "Enter the item category",
  },
  ITEM_CODE: {
    UNIQUE_NAME: "itemCode",
    LABEL: "Item Code",
    PLACEHOLDER: "Enter the item code",
  },
  ITEM_TAGS: {
    UNIQUE_NAME: "itemTags",
    LABEL: "Tags",
    PLACEHOLDER: "Enter tags separated by comma",
  },
  LOCATION_NAME: {
    UNIQUE_NAME: "locationName",
    LABEL: "Location Name",
    PLACEHOLDER: "Enter the location name",
  },
  LOCATION_DESC: {
    UNIQUE_NAME: "locationDesc",
    LABEL: "Location Description",
    PLACEHOLDER: "Enter the location description",
  },
  LOCATION_ADDR: {
    UNIQUE_NAME: "locationAddr",
    LABEL: "Location Address",
    PLACEHOLDER: "Enter the location address",
  },
  LOCATION_PHONE: {
    UNIQUE_NAME: "locationPhone",
    LABEL: "Location Phone",
    PLACEHOLDER: "Enter the location phone number",
  },
  LOCATION_BANNER: {
    UNIQUE_NAME: "locationBanner",
    LABEL: "Location Banner Photo",
    PLACEHOLDER: "This image should be 1029 px wide by 516 px tall.",
  },
  LOCATION_PREP_TIME: {
    UNIQUE_NAME: "locationPrepTime",
    LABEL: "Minimum Prep Time (in minutes)",
    PLACEHOLDER: "Enter the food preparation time.",
  },
  LOCATION_RADIUS: {
    UNIQUE_NAME: "locationRaduis",
    LABEL: "Service Radius (in miles)",
    PLACEHOLDER: "Enter the radius limit.",
  },
  TEMPERATURE_SETTINGS: {
    UNIQUE_NAME: "temperatureSetting",
    LABEL: "Temperature Settings",
    PLACEHOLDER: "Please choose an option",
  },
  TIP_OUT: {
    UNIQUE_NAME: "tipOut",
    LABEL: "Tip Out",
    PLACEHOLDER: "Enter the driver tip out percentage",
  },
  PROFILE_IMAGE: {
    UNIQUE_NAME: "profileImage",
    LABEL: "Profile Photo",
    PLACEHOLDER: "This image should be 1029 px wide by 516 px tall.",
  },
  FIRST_NAME: {
    UNIQUE_NAME: "firstName",
    LABEL: "First Name",
    PLACEHOLDER: "Enter the first name",
  },
  LAST_NAME: {
    UNIQUE_NAME: "lastName",
    LABEL: "Last Name",
    PLACEHOLDER: "Enter the last name",
  },
  TAX: {
    UNIQUE_NAME: "tax",
    LABEL: "Tax",
    PLACEHOLDER: "Enter the tax percentage",
  },
  DELIVERY_CHARGES: {
    UNIQUE_NAME: "deliveryCharges",
    LABEL: "Delivery Charges",
    PLACEHOLDER: "Enter the delivery fees",
  },
  RESTAURANT_BANNER: {
    UNIQUE_NAME: "restaurantBanner",
    LABEL: "Restaurant Banner Photo",
    PLACEHOLDER: "This image should be 1029 px wide by 516 px tall.",
  },
  RESTAURANT_NAME: {
    UNIQUE_NAME: "restaurantName",
    LABEL: "Location Name",
    PLACEHOLDER: "Enter the location name",
  },
  RESTAURANT_DESC: {
    UNIQUE_NAME: "restaurantDesc",
    LABEL: "Restaurant Description",
    PLACEHOLDER: "Enter the restaurant description",
  },
  OPENING_TIME: {
    UNIQUE_NAME: "opening_time",
    LABEL: "Opening Time",
    PLACEHOLDER: "HH:MM",
  },
  CLOSING_TIME: {
    UNIQUE_NAME: "closing_time",
    LABEL: "ClosingTime",
    PLACEHOLDER: "HH:MM",
  },
};

export const IMAGE = {
  LOGO: {
    PATH: "/assets/images/logo_green.png",
    ALT: "Logo",
    WIDTH: "168px",
    HEIGHT: "36px",
  }
};

export const LINKS = {
  SIGNIN: "/",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",

  MANAGER: "/manager",
  MANAGER_LOCATION: "/manager/location",
  LOCATION_MENU: "/manager/location/menu",
  LOCATION_SETTINGS: "/manager/location/settings",
  MENU_CATEGORIES: "/manager/location/menu/categories",
  MENU_MODIFIERS: "/manager/location/menu/modifiers",
  CATEGORY: "/manager/location/menu/category/1",
  REPORTS: "/manager/report",
  USERS: "/manager/user",
};

export const GoogleApi = {
  GOOGLE_MAP_SCRIPT_BASE_URL: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
};

export const APPBAR_ITEMS = [
  {
    icon: <HomeIcon />,
    title: STRING.HOME,
    link: LINKS.MANAGER_LOCATION,
    active: false,
  },
];

export const MENUBAR_ITEMS = [
  {
    icon: <MenuIcon />,
    title: STRING.MENU,
    link: LINKS.LOCATION_MENU,
    active: true,
  },
  // {
  //   icon: <OrderIcon />,
  //   title: STRING.ORDERS,
  //   link: LINKS.LOCATION_MENU,
  //   active: false,
  // },
  // {
  //   icon: <TeamMemberIcon />,
  //   title: STRING.TEAM_MEMBERS,
  //   link: LINKS.LOCATION_MENU,
  //   active: false,
  // },
  {
    icon: <ReportIcon />,
    title: STRING.REPORTS,
    link: LINKS.REPORTS,
    active: false,
  },
  {
    icon: <LocationSettingIcon />,
    title: STRING.LOCATION_SETTING,
    link: LINKS.LOCATION_SETTINGS,
    active: false,
  },
  {
    icon: <TeamMemberIcon />,
    title: STRING.USERS,
    link: LINKS.USERS,
    active: false,
  },
];

export const IDENTITY_TYPE = {
  EMAIL: "email",
  FORGOT_PASSWORD: "forgot_password",
};

export const SEVERITY = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const DRAWER_WIDTH = 320;
