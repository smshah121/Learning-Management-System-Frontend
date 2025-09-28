import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi =createApi({
    reducerPath: 'authApi',
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
    endpoints: (builder)=> ({
        login: builder.mutation({
            query: (Credentials)=>({
                url: '/auth/login',
                method: 'POST',
                body: Credentials
            }),
        }),

        signup: builder.mutation({
            query: (newUser)=> ({
                url: '/auth/register',
                method: 'POST',
                body: newUser
            })
        })
    })
})

export const {useLoginMutation, useSignupMutation} = authApi