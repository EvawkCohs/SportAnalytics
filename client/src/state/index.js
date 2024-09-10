import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  teamId: "sportradar.dhbdata.411-1648",
  teamGamesData: [],
  isLoaded: false,
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
    setIsLoaded: (state) => {
      state.isLoaded = state.isLoaded === false ? true : false;
    },
  },
});

export const { setMode, setId, setTeamGamesData, setIsLoaded } =
  globalSlice.actions;

export default globalSlice.reducer;
