import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress, Typography } from "@mui/material";
import { getCsrfToken, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Submit from "../components/Button/Submit";
import ErrorMessage from "../components/ErrorMessage";
import Email from "../components/Fields/Email";
import Password from "../components/Fields/Password";
import AuthLayout from "../components/Layout/Auth";
import Logo from "../components/Logo";
import { LoginFormSchema } from "../constants/ValidationSchema";
import { LINKS, STRING } from "../lib/constants";

const Login = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  /*Form validation*/
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(LoginFormSchema),
    mode: "onChange",
  });

  /*Sign in form submission*/
  const loginFormSubmission = async (loginFormData) => {
    setisLoading(true);
    const res = await signIn("credentials", {
      email: loginFormData.email,
      password: loginFormData.password,
      redirect: false,
    });
    setisLoading(false);
    if (res.ok) {
      router.push(LINKS.MANAGER_LOCATION);
    }
    if (res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <AuthLayout>
      <Logo />
      <Typography className="title">{STRING.LGN.TITLE}</Typography>
      <form onSubmit={handleSubmit(loginFormSubmission)}>
        <Email
          {...register("email")}
          error={Boolean(errors.email)}
          helperText={errors.email && errors.email.message}
        />

        <Password
          {...register("password")}
          error={Boolean(errors.password)}
          helperText={errors.password && errors.password.message}
        />

        <hr className="mt-1 mb-1" />

        <ErrorMessage message={errorMessage} />

        <Submit className="mb-1" disabled={!isValid || !isDirty || isLoading}>
          {isLoading ? (
            <CircularProgress
              size={20}
              thickness={5}
              sx={{ marginRight: "5px" }}
            />
          ) : (
            STRING.LGN.BTN
          )}
        </Submit>
      </form>

      <Link href={LINKS.FORGOT_PASSWORD} passHref>
        {STRING.LGN.FRGT_PASS_TEXT}
      </Link>
    </AuthLayout>
  );
};

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken: csrfToken || null,
    },
  };
}

export default Login;
