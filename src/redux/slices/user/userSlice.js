import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    displayName: null,
    createdAt: null,
    survivorId: null,
    authenticated: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.id = action.payload.user.id;
            state.displayName = action.payload.user.displayName;
            state.createdAt = action.payload.user.createdAt;
            state.survivorId = action.payload.user.survivorId;
            state.authenticated = true;
        },
        logoutUser() {
            return initialState;
        },
    },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
