import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});
