import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    survivor: null,
};

const survivorSlice = createSlice({
    name: "survivor",
    initialState,
    reducers: {
        setSurvivor(state, action) {
            state.survivor = action.payload;
        },
        updateSurvivor(state, action) {
            state.survivor = { ...state.survivor, ...action.payload };
        },
        clearSurvivor() {
            return initialState;
        },
    },
});

export const { setSurvivor, updateSurvivor, clearSurvivor } = survivorSlice.actions;
export default survivorSlice.reducer;
