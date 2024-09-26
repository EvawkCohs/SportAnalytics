import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  teamId: "sportradar.dhbdata.411-1648",
  teamName: "TV Gelnhausen",
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
    setTeamName: (state, action) => {
      state.teamName = action.payload;
    },
  },
});

export const { setMode, setId, setTeamName } = globalSlice.actions;

export default globalSlice.reducer;
