import { AlternateEmail } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useSnackbar } from "notistack";
import * as React from "react";
import GoogleButton from "react-google-button";
import { useAuth } from "reactfire";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";
import EmailSignInDialogForm from "../../components/elements/EmailSignInDialogForm";
import { isProd } from "../../utils/constants";
import { log } from "../../utils/logs";


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
                columns={{ xs: 2, sm: 4, md: 6 }}
            >

                <Grid item
                    xs={2}
                    sm={4}
                    md={6}
                >
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
        </>
    );
};

export default SignInPage;