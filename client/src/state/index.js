import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  teamId: "sportradar.dhbdata.1893-1648",
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
  },
});

export const { setMode, setId } = globalSlice.actions;

export default globalSlice.reducer;
