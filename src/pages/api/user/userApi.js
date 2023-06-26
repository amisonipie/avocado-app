import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";
const BASE_URL = "https://api.avocadodelivers.app/v1.0/";

axios.defaults["content-type"] = "application/json";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User", "user"],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: ({ roleId, emailId, firstName, page, rowsPerPage }) => {
        return {
          method: "get",
          url: `user?filter[role_id]=${roleId}&filter[email]=${emailId}&filter[first_name]=${firstName}&page=${page}&per_page=${rowsPerPage}`,
        };
      },
      providesTags: [{ type: "User", id: "LIST" }],
      transformResponse: (response) => {
        return response.result.data;
      }
    }),
    getRoles: builder.query({
      query: (body) => {
        const fields = JSON.stringify([
          "id",
          "name",
          "scope",
          "type",
          "category"
        ]);
        return {
          method: "get",
          url: `user/roles?fields=${fields}`,
        };
      },
      providesTags: [{ type: "User", id: "LIST" }],
      transformResponse: (response) => {
        return response.result.data;
      }
    }),
    getDriverRolesUser: builder.query({
      query: (body) => {
        const fields = JSON.stringify([
          "id",
          "name",
          "scope",
          "type",
          "category"
        ]);
        return {
          method: "get",
          url: `user/roles?fields=${fields}&filter[scope]=domain&filter[type]=driver&filter[category]=user`,
        };
      },
      providesTags: [{ type: "User", id: "LIST" }],
      transformResponse: (response) => {
        return response.result.data;
      }
    }),
    getSingleUserList: builder.query({
      query: ({ id }) => ({
        url: `user/${id}`,
        method: "get",
      }),
      invalidatesTags: ["user"],
      transformResponse: (response) => {
        return response.result.data;
      }
    }),
    updateSingleUserList: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `user/${id}`,
        method: "POST",
        headers: { 'Content-Type': 'multipart/form-data' },
        data: body,
      }),
      invalidatesTags: ["user"],
    }),
    registerData: builder.mutation({
      query: (body) => ({
        url: `user/register`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["user"],
      transformResponse: (response) => {
        return response.result.data;
      },
    }),
    assignRole: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `user/${id}/role`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["user"],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: `user/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: `user`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    updatePassword: builder.mutation({
      query: (body) => ({
        url: `user/update-password`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: `user/verify-top`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),
    sendOTP: builder.mutation({
      query: (body) => ({
        url: `user/send-otp`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["user"],
    }),
    forgotPassword: builder.mutation({
      query: (body) => {
        return {
          url: `user/forgot-password`,
          method: "POST",
          data: body,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: `user/reset-password`,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useLazyGetUserDetailsQuery,
  useGetUserDetailsQuery,
  useLazyGetRolesQuery,
  useGetRolesQuery,
  useLazyGetDriverRolesUserQuery,
  useGetDriverRolesUserQuery,
  useLazyGetSingleUserListQuery,
  useGetSingleUserListQuery,
  useRegisterDataMutation,
  useAssignRoleMutation,
  useLoginMutation,
  useUpdateUserMutation,
  useUpdateSingleUserListMutation,
  useUpdatePasswordMutation,
  useVerifyOtpMutation,
  useSendOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;
