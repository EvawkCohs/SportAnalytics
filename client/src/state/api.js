import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
  }),

  reducerPath: "adminApi",
  tagTypes: [
    "teammodels",
    "team",
    "game",
    "gamesWithDetails",
    "participation",
    "user",
    "userGame",
  ],

  endpoints: (build) => ({
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
    postUserGame: build.mutation({
      query: (userGameData) => ({
        url: `userGames/add-userGame`,
        method: "POST",
        body: userGameData,
      }),
      invalidatesTags: ["userGame"],
    }),
    getUserProfile: build.query({
      query: () => ({
        url: `users/profile`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }),
      providesTags: ["user"],
    }),
    getUserGames: build.query({
      query: ({ gameId, userId }) => ({
        url: `userGames/findUserGames`,
        params: { gameId, userId },
      }),
      providesTags: ["userGame"],
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
  usePostUserGameMutation,
  useGetUserProfileQuery,
  useGetUserGamesQuery,
} = api;
