import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        recommendation: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/recommend-perfumes`,
                method: 'POST',
                body: data,
            }),
        }),
        addToFavourites: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/add-favourites`,
                method: 'POST',
                body: data,
            }),
        }),
        getFavourites: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/favourites`,
                method: 'GET',
            }),
        }),
        removePerfume: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/favourites/remove`,
                method: 'DELETE',
                body: data,
            }),
        })        
    }),
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation, useRecommendationMutation, useAddToFavouritesMutation, useGetFavouritesMutation, useRemovePerfumeMutation } = usersApiSlice;