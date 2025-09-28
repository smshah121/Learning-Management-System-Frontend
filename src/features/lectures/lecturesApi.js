import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lectureApi = createApi({
    reducerPath: "lecturesApi",
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
    tagTypes: ['lecture'],
    endpoints: (builder) => ({
        getLecturesByCourse: builder.query({
            query: (courseId) => `/lectures/course/${courseId}`,
            transformResponse: (response) => {
    console.log("🔁 Raw lecture API response:", response); // ✅ Add this to debug
    return response; // This line is okay if it's already an array
  },

            providesTags: (result, error, courseId) => [
                { type: 'lecture', id: `course-${courseId}` }
            ]
        }),
        
        addLecture: builder.mutation({
            query: (lecture) => ({
                url: "/lectures",
                method: "POST",
                body: lecture
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: 'lecture', id: `course-${courseId}` }
            ]
        }),
        
        updateLecture: builder.mutation({
            query: ({ id, data }) => ({
                url: `/lectures/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: 'lecture', id: `course-${courseId}` }
            ]
        }),
        
        deleteLecture: builder.mutation({
            query: ({id}) => ({
                url: `/lectures/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: 'lecture', id: `course-${courseId}` }
            ]
        })
    })
});

export const { 
    useGetLecturesByCourseQuery, 
    useAddLectureMutation, 
    useUpdateLectureMutation, 
    useDeleteLectureMutation 
} = lectureApi;