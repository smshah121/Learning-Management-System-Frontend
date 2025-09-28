import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';





export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => '/auth/profile',
      providesTags: ["CurrentUser"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/user/${id}`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const { useGetCurrentUserQuery, useUpdateUserMutation } = userApi;
