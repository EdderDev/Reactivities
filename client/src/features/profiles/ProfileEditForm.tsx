import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { Box, Button } from "@mui/material";
import { editProfileSchema, type EditProfileSchema } from "../../lib/schemas/editProfileSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../app/shared/components/TextInput";
import { useEffect } from "react";

type Props = {
    setEditMode: (editMode: boolean) => void;
}

export default function ProfileEditForm({ setEditMode }: Props) {

    const { id: userId } = useParams();
    const { editProfile, profile } = useProfile(userId);

    const { control, reset, handleSubmit, formState: { isDirty, isValid } } = useForm<EditProfileSchema>({
        mode: "onTouched",
        resolver: zodResolver(editProfileSchema)
    });

    useEffect(() => {
        reset({
            displayName: profile?.displayName,
            bio: profile?.bio || ""
        });
    }, [profile, reset]);

    const onSubmit = async (data: EditProfileSchema) => {
        editProfile.mutate(data, {
            onSuccess: () => setEditMode(false)
        })
    }


    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                mt: 3,
                gap: 3
            }}
        >
            <TextInput label="DisplayName" control={control} name="displayName" />
            <TextInput label="Add your bio" control={control} name="bio" multiline rows={4} />
            <Button type="submit" variant="contained" size="large" disabled={!isValid || !isDirty || editProfile.isPending}>
                Update profile
            </Button>
        </Box>
    )
}