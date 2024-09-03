import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  teamId: "sportradar.dhbdata.411-1648",
  teamGamesData: [],
  addedGames: [],
};
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setId: (state, action) => {
      state.teamId = action.payload;
    },
    setTeamGamesData: (state, action) => {
      state.teamGamesData = action.payload;
    },
    addGame: (state, action) => {
      state.addedGames.push(action.payload);
    },
  },
});

export const { setMode, setId, setTeamGamesData, addGame } =
  globalSlice.actions;

export default globalSlice.reducer;
