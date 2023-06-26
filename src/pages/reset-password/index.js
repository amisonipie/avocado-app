import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Submit from "../../components/Button/Submit";
import ErrorMessage from "../../components/ErrorMessage";
import OTP from "../../components/Fields/OTP";
import Password from "../../components/Fields/Password";
import AuthLayout from "../../components/Layout/Auth";
import { RstPassFormSchema } from "../../constants/ValidationSchema";
import { FIELD, LINKS, SEVERITY, STRING } from "../../lib/constants";
import { showAlert } from "../../store/slice/alertSlice";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../api/user/userApi";

const ResetPasswordSuccess = () => {
  return (
    <Grid item>
      <Typography className="title">{STRING.RST_SUCCESS.TITLE}</Typography>
      <Typography className="subtitle mb-2">
        {STRING.RST_SUCCESS.SUBTITLE}
      </Typography>

      <Link href={LINKS.SIGNIN} passHref>
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
          {STRING.FRGT_PASS.LGN_TEXT}
        </Button>
      </Link>
    </Grid>
  );
};

const ResetPassword = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.email);
  const [resetPassword, { isSuccess, error, isLoading }] =
    useResetPasswordMutation();

  const [forgotPassword, { isSuccess: isSendOTPSuccess }] =
    useForgotPasswordMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { user_id } = router.query;
  /*Form validation*/
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(RstPassFormSchema),
    mode: "onChange",
  });

  /*Reset password form submission**/
  const resetPasswordFormSubmit = async (rstPassFormData) => {
    const { otp, password, confirmPassword } = rstPassFormData;
    const body = {
      otp: otp,
      password,
      password_confirmation: confirmPassword,
      user_id,
    };
    await resetPassword(body);
  };

  useEffect(() => {
    if (error && error.data && error.data.error) {
      setErrorMessage(error.data.error.message);
    }
  }, [error]);

  const handleResendOTP = async () => {
    setErrorMessage("");

    await forgotPassword({
      email,
    });
  };

  useEffect(() => {
    if (isSendOTPSuccess) {
      dispatch(
        showAlert({
          severity: SEVERITY.SUCCESS,
          text: "A new OTP has been sent to your email.",
        })
      );
    }
    // eslint-why will cause unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSendOTPSuccess]);

  return (
    <AuthLayout>
      {isSuccess === false ? (
        <>
          <Typography className="title">{STRING.RST_PASS.TITLE}</Typography>
          <form onSubmit={handleSubmit(resetPasswordFormSubmit)}>
            <OTP
              {...register("otp")}
              error={Boolean(errors.otp)}
              helperText={errors.otp && errors.otp.message}
              inputProps={{
                maxLength: 6,
              }}
            />

            <Password
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password && errors.password.message}
              label={FIELD.RST_PASS.LABEL}
              placeholder={FIELD.RST_PASS.PLACEHOLDER}
            />

            <Password
              {...register("confirmPassword")}
              error={Boolean(errors.confirmPassword)}
              helperText={
                errors.confirmPassword && errors.confirmPassword.message
              }
              label={FIELD.CNFRM_RST_PASS.LABEL}
              placeholder={FIELD.CNFRM_RST_PASS.PLACEHOLDER}
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
                STRING.RST_PASS.BTN
              )}
            </Submit>
            <Grid container direction="row">
              <Grid item xs={12}>
                <Link href="#">
                  <a onClick={handleResendOTP}>{STRING.LGN.RESEND_OTP}</a>
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link href={LINKS.SIGNIN} passHref>
                  {STRING.LGN.BACK_TO_LOGIN}
                </Link>
              </Grid>
            </Grid>
          </form>
        </>
      ) : (
        <ResetPasswordSuccess />
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
