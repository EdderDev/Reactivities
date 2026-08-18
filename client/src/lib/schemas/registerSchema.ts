import z from "zod"
import { requiredString } from "../util/util"

export const registerSchema = z.object({
    email: z.email(),
    displayName: requiredString("displayName"),
    password: requiredString("password")
})

export type RegisterSchema = z.input<typeof registerSchema>;