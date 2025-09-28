import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice"
import { authApi } from "../features/auth/authApi";
import { courseApi } from "../features/course/courseApi";
import { lectureApi } from "../features/lectures/lecturesApi";
import { enrollmentApi } from "../features/enrollment/enrollmentApi";
import { userApi } from "../features/user/userApi";
import { announcementApi } from "../features/announcement/announcementApi";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]:authApi.reducer,
        [courseApi.reducerPath]:courseApi.reducer,
        [lectureApi.reducerPath]:lectureApi.reducer,
        [enrollmentApi.reducerPath]: enrollmentApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [announcementApi.reducerPath]:announcementApi.reducer
    },

    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(
            authApi.middleware,
            courseApi.middleware,
            lectureApi.middleware,
            enrollmentApi.middleware,
            userApi.middleware,
            announcementApi.middleware
        )
})