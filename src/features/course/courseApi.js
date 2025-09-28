import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Course'], // Add cache tags
    endpoints: (builder) => ({
        getCourse: builder.query({
            query: () => "/courses",
            providesTags: ['Course'], // Provide cache tag
        }),

        getMyCourses: builder.query({
           query: () => "/courses/my",
           providesTags: ['Course'],
           }),

        getAvailableCourses: builder.query({
            query: ()=> "/courses/available",
            providesTags: ["Course"]

        }),
        createCourse: builder.mutation({
            query: (data) => ({
                url: "/courses",
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Course'], // Invalidate cache after creating
        }),
        updateCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `/courses/${id}`, // Fixed: was `/course/${id}`, should be `/courses/${id}`
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['Course'], // Invalidate cache after updating
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Course'], // Invalidate cache after deleting
        })
    })
});

export const { 
    useGetCourseQuery, 
    useCreateCourseMutation, 
    useUpdateCourseMutation, 
    useDeleteCourseMutation,
    useGetMyCoursesQuery,
    useGetAvailableCoursesQuery
} = courseApi;