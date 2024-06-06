import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["allgamesmodels"],

  endpoints: (build) => ({
    getallGamesModel: build.query({
      query: () => `client/allgamesmodels`,
      providesTags: ["allgamesmodels"],
    }),
  }),
});

export const { useGetallGamesModelQuery } = api;
