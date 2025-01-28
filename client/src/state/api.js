import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: [
    "allgamesmodels",
    "teammodels",
    "team",
    "game",
    "gamesWithDetails",
    "participation",
    "user",
  ],

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
    getGameModel: build.query({
      query: (id) => `gameUploadCheck/gamemodels?id=${id}`,
      providesTags: ["game"],
    }),
    getGamesWithDetails: build.query({
      query: (ids) => {
        // IDs in eine durch Kommas getrennte Liste umwandeln
        const idsParam = ids.join(",");
        return `client/gamemodels/details?ids=${idsParam}`;
      },
      providesTags: ["gamesWithDetails"],
    }),
    getGamesWithParticipation: build.query({
      query: (teamId) => `client/gamemodels/participation?id=${teamId}`,
      providesTags: ["participation"],
    }),
    registerUser: build.mutation({
      query: (userData) => ({
        url: `users/register`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["user"],
    }),
    logInUser: build.mutation({
      query: (credentials) => ({
        url: `users/login`,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetallGamesModelQuery,
  useGetTeamModelQuery,
  useGetTeamQuery,
  useGetGameModelQuery,
  useGetGamesWithDetailsQuery,
  useGetGamesWithParticipationQuery,
  useRegisterUserMutation,
  useLogInUserMutation,
} = api;
