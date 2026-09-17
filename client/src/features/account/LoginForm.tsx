import { useForm, useWatch } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount"
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";

export default function LoginForm() {
    const [notVerified, setNotVerified] = useState(false);
    const { loginUser, resendConfirmationEmail } = useAccount();
    const navigate = useNavigate();
    const location = useLocation();
    const { control, handleSubmit, formState: { isValid, isSubmitting } } = useForm<LoginSchema>({
        mode: "onTouched",
        resolver: zodResolver(loginSchema)
    });
    const email = useWatch({ control, name: "email" });

    const handleResendEmail = async () => {
        try {
            await resendConfirmationEmail.mutateAsync({ email });
            setNotVerified(false);
        } catch (error) {
            console.log(error);
        }

    }

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                navigate(location.state?.from || "/activities")
            },
            onError: error => {
                if (error.message === "NotAllowed") {
                    setNotVerified(true);
                }
            }
        });
    }

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: "flex",
                flexDirection: "column",
                p: 3,
                gap: 3,
                maxWidth: "md",
                mx: "auto",
                borderRadius: 3
            }}
        >
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                color: "secondary.main"
            }}>
                <LockOpen fontSize="large" />
                <Typography variant="h4">Sign in</Typography>
            </Box>
            <TextInput label="Email" control={control} name="email" />
            <TextInput label="Password" type="password" control={control} name="password" />
            <Button type="submit" disabled={!isValid || isSubmitting} variant="contained" size="large">
                Login
            </Button>

            {notVerified ? (
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Typography sx={{ textAlign: "center" }} color="error">
                        Your email has not been verified. You can click the button to re-send the verification
                    </Typography>
                    <Button
                        disabled={resendConfirmationEmail.isPending}
                        onClick={handleResendEmail}
                    >
                        Re-send email link
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                    <Typography>
                        Forgot password? Click <Link to="/forgot-password">here</Link>
                    </Typography>
                    <Typography sx={{ textAlign: "center" }}>
                        Don't have an account?
                        <Typography sx={{ ml: 2 }} component={Link} to="/register" color="primary">
                            Register
                        </Typography>
                    </Typography>
                </Box>

            )}


        </Paper>
    )
}