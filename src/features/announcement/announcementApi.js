import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const announcementApi = createApi({
  reducerPath: "announcementApi",
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
  tagTypes: ['Announcement'],
  endpoints: (builder) => ({
    getAnnouncementsByCourse: builder.query({
      query: (courseId) => `/announcements/course/${courseId}`,
      providesTags: ['Announcement'],
    }),
    createAnnouncement: builder.mutation({
      query: (data) => ({
        url: "/announcements",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Announcement'],
    }),
    deleteAnnouncement: builder.mutation({
        query: (id)=> ({
            url: `/announcements/${id}`,
            method: "DELETE"
        }),
        invalidatesTags:["Announcement"]
    })
  })
});

// Export hooks
export const {
  useGetAnnouncementsByCourseQuery,
  useCreateAnnouncementMutation,
  useDeleteAnnouncementMutation
} = announcementApi;
