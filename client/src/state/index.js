import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  teamId: "sportradar.dhbdata.489-1648",
  gameData: {},
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
    setGameData: (state, action) => {
      state.gameData = action.payload;
    },
  },
});

export const { setMode, setId, setGameData } = globalSlice.actions;

export default globalSlice.reducer;
