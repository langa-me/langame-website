/* eslint-disable no-unused-vars */
import { AlternateEmail } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Tooltip } from "@mui/material";
import { getApp } from "firebase/app";
import { GoogleAuthProvider, signInWithCustomToken, signInWithPopup } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useSnackbar } from "notistack";
import * as React from "react";
import GoogleButton from "react-google-button";
import { useHistory } from "react-router-dom";
import { useAuth, useFunctions, useSigninCheck } from "reactfire";
import { ReactComponent as Discord } from "../../assets/images/discord.svg";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";
import EmailSignInDialogForm from "../../components/elements/EmailSignInDialogForm";
import { isEmulator, isLocal, isProd } from "../../utils/constants";
import { initEmulator } from "../../utils/firebase";
import { log } from "../../utils/logs";
import { useQuery } from "../../utils/route";

const SignInPage = () => {
    const auth = useAuth();
    const {data: signedIn} = useSigninCheck();
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
    if (
        isLoading ||
        // there is "code" in the url bar
        window.location.href.includes("code")
    ) {
        return <CenteredCircularProgress />;
    }

    // if (signedIn) {
    //     return <Redirect to="/account" />;
    // }
    

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
                    (isLocal || isProd) &&
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
                (isLocal || isProd) &&
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