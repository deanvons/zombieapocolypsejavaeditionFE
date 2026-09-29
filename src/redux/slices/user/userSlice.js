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
            state.username = action.payload.username;
            state.authenticated = true;
        },
        logoutUser() {
            return initialState;
        },
    },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
