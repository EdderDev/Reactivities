import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import agent from "../api/agent"
import { useMemo } from "react";

export const useProfile = (userId?: string) => {

    const queryClient = useQueryClient()

    const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
        queryKey: ["profile", userId],
        queryFn: async () => {
            const response = await agent.get<Profile>(`/profiles/${userId}`);
            return response.data
        },
        enabled: !!userId
    })

    const { data: photos, isLoading: loadingPhotos } = useQuery<Photo[]>({
        queryKey: ["photos", userId],
        queryFn: async () => {
            const response = await agent.get<Photo[]>(`/profiles/${userId}/photos`);
            return response.data
        },
        enabled: !!userId
    })

    const uploadPhoto = useMutation({
        mutationFn: async (file: Blob) => {
            const formData = new FormData();
            formData.append("file", file)
            const response = await agent.post("/profiles/add-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data;
        },
        onSuccess: async (photo: Photo) => {
            await queryClient.invalidateQueries({
                queryKey: ["photos", userId]
            });
            queryClient.setQueryData(["user"], (data: User) => {

                if (!data)
                    return data;

                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            })
            queryClient.setQueryData(["profile", userId], (data: Profile) => {

                if (!data)
                    return data;

                return {
                    ...data,
                    imageUrl: data.imageUrl ?? photo.url
                }
            })
        }
    })

    const setMainPhoto = useMutation({

        mutationFn: async (photo: Photo) => {
            await agent.put(`/profiles/${photo.id}/setMain`, {})
        },
        onMutate: async (photo: Photo) => {
            await queryClient.cancelQueries({ queryKey: ["user"] });
            await queryClient.cancelQueries({ queryKey: ["profile", userId] });

            const prevUser = queryClient.getQueryData<User>(["user"]);
            const prevProfile = queryClient.getQueryData<Profile>(["profile", userId]);

            queryClient.setQueryData<User>(["user"], oldUser => {
                if (!oldUser)
                    return oldUser;

                return {
                    ...oldUser,
                    imageUrl: photo.url
                };
            });
            queryClient.setQueryData<Profile>(["profile", userId], oldProfile => {
                if (!oldProfile)
                    return oldProfile;

                return {
                    ...oldProfile,
                    imageUrl: photo.url
                };
            });


            return { prevUser, prevProfile };
        },
        onError: (error, photo, context) => {
            console.log(error);
            if (context?.prevUser) {
                queryClient.setQueryData(["user"], context.prevUser)
            }
            if (context?.prevProfile) {
                queryClient.setQueryData(["profile", userId], context.prevProfile)
            }
        }


        // onSuccess: (_, photo) => {
        //     queryClient.setQueryData(["user"], (userData: User) => {

        //         if (!userData)
        //             return userData;

        //         return {
        //             ...userData,
        //             imageUrl: photo.url
        //         }
        //     })
        //     queryClient.setQueryData(["profile", userId], (profile: Profile) => {

        //         if (!profile)
        //             return profile;

        //         return {
        //             ...profile,
        //             imageUrl: photo.url
        //         }
        //     })
        // }
    })

    const deletePhoto = useMutation({
        mutationFn: async (photoId: string) => {
            await agent.delete(`/profiles/${photoId}/photos`)
        },
        onSuccess: (_, photoId) => {
            queryClient.setQueryData(["photos", userId], (photos: Photo[]) => {
                return photos?.filter(x => x.id !== photoId)
            })
        }
    })

    const isCurrentUser = useMemo(() => {
        return userId === queryClient.getQueryData<User>(["user"])?.id
    }, [userId, queryClient])

    return {
        profile,
        loadingProfile,
        photos,
        loadingPhotos,
        isCurrentUser,
        uploadPhoto,
        setMainPhoto,
        deletePhoto
    }
}

