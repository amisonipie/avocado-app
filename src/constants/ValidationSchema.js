import * as yup from "yup";

export const ValidationMessage = {
  EMAIL_REQUIRED: "Email id is required",
  INVALID_EMAIL: "Invalid email id",
  PASSWORD_REQUIRED: "Password is required",
  STRONG_PASSWORD_REQUIRED:
    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
  PASSWORD_MISMATCH: "Password and Confirm password should match",
  DIGITS_ONLY: "The field should have digits only",
  DIGIT_LENGTH: "Must be exactly 6 digits",
  PREP_TIME_MIN_VALUE: "Prep time should be greater than 0",
  SERVICE_RADIUS_MIN_VALUE: "Service Radius should be greater than 0",
  REQUIRED_FIELD: "This field is required",
};

export const LoginFormSchema = yup
  .object({
    email: yup
      .string()
      .required(ValidationMessage.EMAIL_REQUIRED)
      .email(ValidationMessage.INVALID_EMAIL),
    password: yup
      .string()
      .required(ValidationMessage.PASSWORD_REQUIRED)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        ValidationMessage.STRONG_PASSWORD_REQUIRED
      ),
  })
  .required();

export const FrgtPassFormSchema = yup
  .object({
    email: yup
      .string()
      .required(ValidationMessage.EMAIL_REQUIRED)
      .email(ValidationMessage.INVALID_EMAIL),
  })
  .required();

export const RstPassFormSchema = yup
  .object({
    password: yup
      .string()
      .required(ValidationMessage.PASSWORD_REQUIRED)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        ValidationMessage.STRONG_PASSWORD_REQUIRED
      ),
    confirmPassword: yup
      .string()
      .required(ValidationMessage.PASSWORD_REQUIRED)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        ValidationMessage.STRONG_PASSWORD_REQUIRED
      )
      .oneOf([yup.ref("password"), null], ValidationMessage.PASSWORD_MISMATCH),
    otp: yup
      .string()
      .matches(/^\d+$/, ValidationMessage.DIGITS_ONLY)
      .test("len", ValidationMessage.DIGIT_LENGTH, (val) => val.length === 6),
  })
  .required();

export const LocationFormSchema = yup
  .object({
    prep_time: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD)
      .test(
        "len",
        ValidationMessage.PREP_TIME_MIN_VALUE,
        (val) => Number(val) > 0
      ),

    service_radius: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD)
      .test(
        "len",
        ValidationMessage.SERVICE_RADIUS_MIN_VALUE,
        (val) => Number(val) > 0 || val === ""
      ),
    secret_pin: yup.string().required(ValidationMessage.REQUIRED_FIELD),
    secret_key: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD)
      .min(8, "Secret key must be at least 8 characters long"),
  })
  .required();

export const UserFormSchema = yup
  .object({
    first_name: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    last_name: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    role: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    email: yup
      .string()
      .required(ValidationMessage.EMAIL_REQUIRED)
      .email(ValidationMessage.INVALID_EMAIL),
    password: yup
      .string()
      .required(ValidationMessage.PASSWORD_REQUIRED)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        ValidationMessage.STRONG_PASSWORD_REQUIRED
      ),
    confirmPassword: yup
      .string()
      .required(ValidationMessage.PASSWORD_REQUIRED)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        ValidationMessage.STRONG_PASSWORD_REQUIRED
      )
      .oneOf([yup.ref("password"), null], ValidationMessage.PASSWORD_MISMATCH),
    mobile: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD)
      .min(8, "Secret key must be at least 8 characters long"),
  })
  .required();

export const RestaurantFormSchema = yup
  .object({
    name: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    description: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    tip_out: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    tax: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    delivery_fees: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    prep_time: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD)
      .test(
        "len",
        ValidationMessage.PREP_TIME_MIN_VALUE,
        (val) => Number(val) > 0
      ),

    service_radius: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD)
      .test(
        "len",
        ValidationMessage.SERVICE_RADIUS_MIN_VALUE,
        (val) => Number(val) > 0 || val === ""
      ),
    secret_pin: yup.string().required(ValidationMessage.REQUIRED_FIELD),
    secret_key: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD)
      .min(8, "Secret key must be at least 8 characters long"),
    opening_time: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD),
    closing_time: yup
      .string()
      .required(ValidationMessage.REQUIRED_FIELD)
  })
  .required();