import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Submit from "../../components/Button/Submit";
import ErrorMessage from "../../components/ErrorMessage";
import Email from "../../components/Fields/Email";
import AuthLayout from "../../components/Layout/Auth";
import { FrgtPassFormSchema } from "../../constants/ValidationSchema";
import { LINKS, STRING } from "../../lib/constants";
import { setUserEmail } from "../../store/slice/userSlice";
import { useForgotPasswordMutation } from "../api/user/userApi";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [userId, setuserId] = useState("second");
  const [forgotPassword, { isSuccess, data, error, isLoading }] =
    useForgotPasswordMutation();
  const [errorMessage, setErrorMessage] = useState("");

  /*Form validation*/
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(FrgtPassFormSchema),
    mode: "onChange",
  });

  /*Forgot password form submission*/
  const forgotPassFormSubmission = async ({ email }) => {
    dispatch(setUserEmail({ email }));
    await forgotPassword({
      email,
    });
  };

  useEffect(() => {
    if (error && error.data && error.data.error) {
      setErrorMessage(error.data.error.message);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess && data) {
      const { result } = data;
      setuserId(result.data.user_id);
    }
  }, [isSuccess, data]);

  const ForgotPasswordSuccess = () => {
    return (
      <Grid item>
        <Typography className="title">{STRING.FRGT_SUCCESS.TITLE}</Typography>
        <Typography className="subtitle mb-2">
          {STRING.FRGT_SUCCESS.SUBTITLE}
        </Typography>

        <Link href={`${LINKS.RESET_PASSWORD}?user_id=${userId}`} passHref>
          <Button
            className="mb-1"
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            style={{
              maxHeight: "70px",
              minHeight: "55px",
              textDecoration: "none",
              color: "#ffffff",
            }}
          >
            {STRING.FRGT_PASS.RESET_TEXT}
          </Button>
        </Link>
      </Grid>
    );
  };

  return (
    <AuthLayout>
      {isSuccess === false ? (
        <Grid item>
          <Typography className="title">{STRING.FRGT_PASS.TITLE}</Typography>
          <Typography className="subtitle mb-2" color="black">
            {STRING.FRGT_PASS.SUBTITLE}
          </Typography>

          <form onSubmit={handleSubmit(forgotPassFormSubmission)}>
            <Email
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email && errors.email.message}
            />

            <hr className="mt-2" />
            <ErrorMessage message={errorMessage} />

            <Submit
              className="mt-1 mb-1"
              disabled={!isValid || !isDirty || isLoading}
            >
              {isLoading ? (
                <CircularProgress
                  size={20}
                  thickness={5}
                  sx={{ marginRight: "5px" }}
                />
              ) : (
                STRING.FRGT_PASS.BTN
              )}
            </Submit>
          </form>

          <Link href={LINKS.SIGNIN} passHref>
            {STRING.FRGT_PASS.LGN_TEXT}
          </Link>
        </Grid>
      ) : (
        <ForgotPasswordSuccess />
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
