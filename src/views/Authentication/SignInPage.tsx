import { AlternateEmail } from "@mui/icons-material";
import { Grid, Button, Typography } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useAuth } from "reactfire";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";
import EmailSignInDialogForm from "../../components/elements/EmailSignInDialogForm";
import { isProd } from "../../utils/constants";
import { log } from "../../utils/logs";
import GoogleButton from "react-google-button"


const SignInPage = () => {
    const auth = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false);
    const provider = new GoogleAuthProvider();
    provider.addScope("email");

    const googleSignIn = () => {
        setIsLoading(true);
        signInWithPopup(auth, provider)
            .then(async (result) => {
                log("success", result);
                enqueueSnackbar("Signed in", { variant: "success" });
                // go to /account
                window.location.href = "/account";
            }).catch((error) => {
                log("failure", error);
                enqueueSnackbar(error.message, { variant: "error" });
            }).finally(() => {
                setIsLoading(false);
            });
    }

    if (isLoading) {
        return <CenteredCircularProgress />;
    }

    // Prevent usage on small width screens and display a message
    // in the middle of the screen
    if (window.innerWidth < 1000) {
        return (
            <Grid container justifyContent="center" alignItems="center"
                sx={{
                    height: "100vh",
                    width: "100vw",
                }}
            >
                <Grid item>
                    <Typography variant="h4"
                    // center the text
                        align="center"
                    >
                        Unfortunately, this page is not available on mobile, 
                        please use a desktop device or a larger screen.
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    // Show a centered vertically and horizontally form
    // Used for Firebase authentication
    // It should show email and password fields
    // and a sign in button
    return (
        <>
            <EmailSignInDialogForm 
                open={isEmailDialogOpen}
                onClose={() => setIsEmailDialogOpen(false)}
            />
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{
                    minHeight: "100vh",
                }}
            >
                <Grid
                    item
                    sm={4}
                    padding={20}
                    border={4}
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={10}
                    style={{
                        backgroundColor: "#33363A",
                    }}
                >
                    <Grid item>
                        <GoogleButton
                            color="primary"
                            onClick={googleSignIn}
                        >
                            Google
                        </GoogleButton>
                    </Grid>
                    {!isProd && <Grid item>
                        <Button
                            color="primary"
                            startIcon={<AlternateEmail />}
                            onClick={() => setIsEmailDialogOpen(true)}
                        >
                            Email
                        </Button>
                    </Grid>}
                </Grid>
            </Grid>
        </>
    );
};

export default SignInPage;