import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enrollmentApi = createApi({
    reducerPath: "enrollApi",
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
    tagTypes: ['Enrollment'], // Add cache tags
    endpoints: (builder) => ({
        enrollInCourse: builder.mutation({
            query: ({ courseId }) => ({
                url: `/enrollments`,
                method: "POST",
                body: { courseId }
            }),
            invalidatesTags: ['Enrollment'], // Invalidate cache after enrolling
        }),
        getMyEnrollments: builder.query({
            query: () => "/enrollments/me",
            providesTags: ['Enrollment'], // Provide cache tag
        }),
        
    // already existing endpoints...
    getStudentsByCourse: builder.query({
      query: (courseId) => `/enrollments/course/${courseId}`,
    }),

    removeEnrollment: builder.mutation({
        query: (id)=> ({
            url: `enrollments/${id}`,
            method: "DELETE", 
        }),
        invalidatesTags: ["Enrollment"],
             
    })
 
    })
});

export const { 
    useEnrollInCourseMutation, 
    useGetMyEnrollmentsQuery,
    useGetStudentsByCourseQuery,
    useRemoveEnrollmentMutation

} = enrollmentApi;