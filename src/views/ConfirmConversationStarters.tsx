// This is a react component that displays a confirmation page
// using Material UI.

import { Button, ButtonGroup, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from "@mui/material";
import { collection, deleteDoc, doc, limit, query, setDoc, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "../components/elements/CenteredCircularProgress";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { log } from "../utils/logs";

export const ConfirmConversationStarters = () => {
    const firestore = useFirestore();
    const memesCollection = collection(firestore, "memes");
    const memesQuery = query(memesCollection,
        where("disabled", "==", true),
        limit(1),
    );
    const { data: memes } = useFirestoreCollectionData(memesQuery, { idField: "id" });
    const [shouldTweet, setShouldTweet] = React.useState(false);
    const [conversationStarter, setConversationStarter] = React.useState("");
    const [conversationStarterTopics, setConversationStarterTopics] = React.useState("");
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        setConversationStarter(memes && memes[0] && memes[0].content || "");
        setConversationStarterTopics(memes && memes[0] && memes[0].topics.join(",") || "");
        log("ConfirmMemes", memes);
    }, [memes]);
    const onConfirm = () => {
        log("ConfirmMemes:onConfirm", conversationStarter, conversationStarterTopics);

        if (
            // Check that topics is not empty
            !conversationStarterTopics ||
            // Check that all topics is at least 2 characters long
            conversationStarterTopics.split(",").filter(t => t.length < 2).length > 0
        ) {
            enqueueSnackbar("Topics must be a comma separated string with each topics of at least 2 characters",
                { variant: "error" });
            return;
        }

        if (
            // Check that the conversation starter is long enough
            conversationStarter.length < 10
        ) {
            enqueueSnackbar("Conversation starter must be at least 10 characters long",
                { variant: "error" });
            return;
        }

        // If all validation went well, update the meme and set disabled to false
        setDoc(doc(firestore, "memes", memes[0].id), {
            disabled: false,
            content: conversationStarter,
            topics: conversationStarterTopics.split(","),
            tweet: shouldTweet,
            confirmed: true,
        }).then(() => {
            const link = `https://console.cloud.google.com/firestore/data/memes/${memes[0].id}?project=${firestore.app.options.projectId}`;
            log("ConfirmMemes:onConfirm:success, visit",
                link
            );
            enqueueSnackbar("Success, link copied to clipboard", { variant: "success" });
            navigator.clipboard.writeText(link);
        }).catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        });
    };
    const onDelete = () => {
        log("ConfirmMemes:onDelete", memes[0].id);
        const link = `https://console.cloud.google.com/firestore/data/deleted_memes/${memes[0].id}?project=${firestore.app.options.projectId}`;
        deleteDoc(doc(firestore, "memes", memes[0].id)).then(() => {
            enqueueSnackbar("Success", { variant: "success" });
        }).catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        });
        setDoc(doc(firestore, "deleted_memes", memes[0].id), memes[0], { merge: true }).then(() => {
            enqueueSnackbar("Success, link copied to clipboard", { variant: "success" });
            navigator.clipboard.writeText(link);
        }).catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        });
    };

    if (!memes) {
        return <CenteredCircularProgress />;
    }
    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                marginTop="10%"
            >
                <FormGroup
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        width: "50%",
                    }}
                >

                    <TextField
                        label="Conversation starter"
                        value={conversationStarter}
                        onChange={(e) => setConversationStarter(e.target.value)}
                        multiline
                        maxRows={4}
                        margin="normal"
                        size="medium"
                        variant="outlined" />
                    <TextField
                        label="Topics"
                        margin="normal"
                        value={conversationStarterTopics}
                        onChange={(e) => setConversationStarterTopics(e.target.value)}
                        variant="outlined" />
                    <ButtonGroup
                        variant="text" aria-label="text button group">
                        <Button
                            onClick={onDelete}
                            startIcon={<ArrowBackIos />}
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={onConfirm}
                            endIcon={<ArrowForwardIos />}
                        >
                            Confirm
                        </Button>
                    </ButtonGroup>
                    <FormControlLabel
                        control={<Checkbox value={shouldTweet}
                            onChange={(e) => setShouldTweet(e.target.checked)} />}
                        label="Tweet"
                    />
                </FormGroup>

            </Grid>
        </>
    );
}
