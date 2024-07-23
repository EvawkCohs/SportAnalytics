import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["allgamesmodels", "teammodels", "team"],

  endpoints: (build) => ({
    getallGamesModel: build.query({
      query: () => `client/allgamesmodels`,
      providesTags: ["allgamesmodels"],
    }),
    getTeamModel: build.query({
      query: () => `client/teammodels`,
      providesTags: ["teammodels"],
    }),
    getTeam: build.query({
      query: (id) => `general/teammodels/${id}`,
      providesTags: ["team"],
    }),
  }),
});

export const {
  useGetallGamesModelQuery,
  useGetTeamModelQuery,
  useGetTeamQuery,
} = api;
