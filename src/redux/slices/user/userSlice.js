import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: null,
    authenticated: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            return action.payload;
        },
        logoutUser(state) {
            return null;
        },
    },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
