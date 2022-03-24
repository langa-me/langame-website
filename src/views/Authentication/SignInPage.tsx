import { AlternateEmail } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Tooltip } from "@mui/material";
import { getApp } from "firebase/app";
import { GoogleAuthProvider, signInWithCustomToken, signInWithPopup } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useSnackbar } from "notistack";
import * as React from "react";
import GoogleButton from "react-google-button";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth, useFunctions } from "reactfire";
import { ReactComponent as Discord } from "../../assets/images/discord.svg";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";
import EmailSignInDialogForm from "../../components/elements/EmailSignInDialogForm";
import { isEmulator, isProd } from "../../utils/constants";
import { initEmulator } from "../../utils/firebase";
import { log } from "../../utils/logs";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}
const SignInPage = () => {
    const auth = useAuth();
    const functions = useFunctions();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = React.useState(false);
    const query = useQuery();
    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    React.useEffect(() => {
        if (isEmulator) {
            try {
                initEmulator(getApp());
            } catch (e) {
                log("error", e);
            }
        }
      }, []);
    const googleSignIn = () => {
        setIsLoading(true);
        signInWithPopup(auth, provider)
            .then(async (result) => {
                log("success", result);
                enqueueSnackbar("Signed in", { variant: "success" });
                history.replace("/account");
            }).catch((error) => {
                log("failure", error);
                enqueueSnackbar(error.message, { variant: "error" });
            }).finally(() => {
                setIsLoading(false);
            });
    }

    const discordSignIn = () => {
        setIsLoading(true);
        const discordFn = httpsCallable(functions, "discordAuthentication");
        discordFn()
            .then((result: any) => {
                // replace in result.data.redirect 
                // https://langa.me/* by https://localhost:3000/* if on localhost
                // or https://langa.me/* by https://MY_LOCATION/* if elsewhere
                const redirectUrl = window.location.href.includes("localhost") ?
                    result.data.redirect.replace("langa.me", "localhost:3000") :
                    !window.location.href.includes("langa.me") ?
                        result.data.redirect.replace("langa.me", window.location.href.split("/")[2]) :
                        result.data.redirect;
                window.location.href = redirectUrl;
            });
    };

    React.useEffect(() => {
        if (query.get("code")) {
            const fn = async () => {
                try {
                    const discordFn = httpsCallable<any, any>(functions, "discordAuthentication");
                    const result = await discordFn({token: query.get("code"), guildId: query.get("guild_id")})
                    const result2 = await signInWithCustomToken(auth, result.data.token);
                    const result3 = await discordFn({
                        uid: result2.user.uid
                    });
                    log("success", result3);
                    
                    enqueueSnackbar("Signed in...", { variant: "success" });
                    setTimeout(() => 
                        history.replace("/account/settings")
                    , 1000);
                } catch (e) {
                    log("failure", e);
                    enqueueSnackbar("Unfortunately an error occured", { variant: "error" });
                }
                setIsLoading(false);
            }
            fn();
        }
    }, [query]);
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
                spacing={4}
                direction="column"
                alignItems="center"
                justifyContent="center"
                alignContent="center"
                sx={{
                    minHeight: "100vh",
                    // remove padding from child
                    
                }}
            >
                {
                    (isEmulator || isProd) &&
                    <Grid item
                    >
                        <GoogleButton
                            color="primary"
                            onClick={googleSignIn}
                        >
                            Google
                        </GoogleButton>
                    </Grid>
                }
                { 
                (isEmulator || isProd) &&
                    <Grid item
                        padding={0}
                        // center
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Tooltip title="Sign in with as a Discord server">
                            <LoadingButton
                                color="primary"
                                onClick={discordSignIn}
                                loading={isLoading}
                                variant="outlined"
                                startIcon={<Discord />}
                                sx={{
                                    width: "65%",
                                }}
                            >
                            </LoadingButton>
                        </Tooltip>
                    </Grid>
                }
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