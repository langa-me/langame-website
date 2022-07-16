import { ArrowBackIos, ArrowForwardIos, Clear } from "@mui/icons-material";
import { Autocomplete, Button, ButtonGroup, Checkbox, Divider, FormControlLabel,
    Grid, IconButton, InputAdornment, List, ListItemButton, ListItemText, TextField, Tooltip, Typography } from "@mui/material";
import { collection, deleteDoc, doc, limit, query, setDoc, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "../components/elements/CenteredCircularProgress";
import { log } from "../utils/logs";


export const ConfirmConversationStarters = () => {
    const firestore = useFirestore();
    const memesCollection = collection(firestore, "memes");
    const topicsCollection = collection(firestore, "topics");
    const memesQuery = query(memesCollection,
        where("disabled", "==", true),
        limit(1),
    );
    const memesTotalQuery = query(memesCollection,
        where("disabled", "==", true),
    );
    const topicsQuery = query(topicsCollection)
    const { data: memes } = useFirestoreCollectionData(memesQuery, { idField: "id" });
    const { data: memesTotal } = useFirestoreCollectionData(memesTotalQuery, { idField: "id" });
    const { data: topics } = useFirestoreCollectionData(topicsQuery, { idField: "id" });
    const [shouldTweet, setShouldTweet] = React.useState(false);
    const [conversationStarter, setConversationStarter] = React.useState("");
    const [conversationStarterTopics, setConversationStarterTopics] =
        React.useState<string[]>([]);
    const [showAlternatives, setShowAlternatives] = React.useState(true);
    const [topicsField, setTopicsField] = React.useState("");
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        setConversationStarter(memes && memes[0] && memes[0].content || "");
        setConversationStarterTopics(memes && memes[0] && memes[0].topics || []);
        log("ConfirmMemes", memes);
    }, [memes]);
    const onConfirm = () => {
        log("ConfirmMemes:onConfirm", conversationStarter, conversationStarterTopics);

        if (
            // Check that topics is not empty
            !conversationStarterTopics ||
            // Check that all topics is at least 2 characters long
            conversationStarterTopics.filter((t) => t.length < 2).length > 0
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
            topics: conversationStarterTopics,
            tweet: shouldTweet,
            confirmed: true,
        }, {merge: true}).then(() => {
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


    if (!memes || !topics) {
        return <CenteredCircularProgress />;
    }
    return (
        <React.Fragment>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                marginTop="10%"
            >
                <Grid item>
                    <Grid
                        container
                        spacing={0}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item>
                            <FormControlLabel
                                style={{
                                    // disable text selection
                                    userSelect: "none",
                                    // center
                                    justifyContent: "center",

                                }}
                                control={<Checkbox value={shouldTweet}
                                    onChange={(e) => setShouldTweet(e.target.checked)} />}
                                label="Tweet"
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control={<Checkbox
                                    disabled={
                                        !memes ||
                                        memes.length === 0 ||
                                        memes[0].conversationStarters === undefined ||
                                        memes[0].conversationStarters.length <= 1
                                    }
                                    value={showAlternatives} onChange={() => {
                                        setShowAlternatives(!showAlternatives);
                                    }} />}
                                label="Hide alternative conversation starters generated"
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        label="Conversation starter"
                        value={conversationStarter}
                        InputProps={{
                            endAdornment: conversationStarter && <InputAdornment position="end">
                                <IconButton
                                aria-label="clear"
                                onClick={() => setConversationStarter("")}
                                >
                                <Clear/>
                                </IconButton>
                            </InputAdornment>,
                        }}
                        onChange={(e) => setConversationStarter(e.target.value)}
                        multiline
                        fullWidth
                        maxRows={4}
                        margin="normal"
                        size="medium"
                        variant="outlined" />
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={topics.map((e) => e.id)}
                        getOptionLabel={(option) => option}
                        inputValue={topicsField}
                        onInputChange={(e, value) => setTopicsField(value)}
                        value={conversationStarterTopics}
                        filterSelectedOptions
                        popupIcon={<></>}
                        onChange={(e, value) => {
                            setConversationStarterTopics(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Topics"
                                placeholder="ice breaker"
                            />
                        )}
                    />
                    <ButtonGroup
                        variant="text" aria-label="text button group"
                        sx={{
                            // align child center
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <Tooltip title="Bad conversation starter">
                            <Button
                                onClick={onDelete}
                                startIcon={<ArrowBackIos />}
                            >
                                Delete
                            </Button>
                        </Tooltip>
                        <Tooltip title="Good conversation starter">
                            <Button
                                onClick={onConfirm}
                                endIcon={<ArrowForwardIos />}
                            >
                                Save
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                    {showAlternatives &&
                        memes[0] &&
                        memes[0].conversationStarters &&
                        memes[0].conversationStarters.length > 1 &&
                        <>
                            <Divider
                                sx={{
                                    margin: "10px",
                                }}
                            />
                            <Typography variant="h5" gutterBottom
                                align="center"
                                alignContent="center"
                            >
                                Generated alternatives
                            </Typography>
                            <List>
                                {/* display conversation_starter and classification in a list */}
                                {memes[0].conversationStarters.map((e: any, i: number) => (
                                    <Tooltip title="Copy to clipboard" key={i}>
                                        <ListItemButton key={i}
                                            // copy to clipboard
                                            onClick={() => {
                                                navigator.clipboard.writeText(e.conversation_starter);
                                                enqueueSnackbar("Copied to clipboard", { variant: "success" });
                                            }}
                                        >

                                            <ListItemText
                                                primary={e.conversation_starter}
                                                secondary={"Classification: " + e.classification}
                                            />
                                        </ListItemButton>
                                    </Tooltip>
                                ))}
                            </List>
                        </>
                    }
                </Grid>

                <Grid item>
                    <Typography
                        variant="h6"
                    >
                        {memesTotal?.length} left
                    </Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
