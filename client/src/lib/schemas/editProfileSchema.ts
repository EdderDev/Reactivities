import z from "zod";
import { requiredString } from "../util/util";

export const editProfileSchema = z.object({
    displayName: requiredString("displayName"),
    bio: z.string().optional()
})

export type EditProfileSchema = z.input<typeof editProfileSchema>;