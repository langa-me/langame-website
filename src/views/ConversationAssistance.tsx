import { Tooltip } from "@material-ui/core";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { collection, doc, limit, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "../components/elements/CenteredCircularProgress";
import { log } from "../utils/logs";

export const ConversationAssistance = () => {
    const firestore = useFirestore();
    const conversationsCollection = collection(firestore, "conversations");
    const conversationsQuery = query(conversationsCollection,
        orderBy("updatedAt", "desc"),
        limit(1),
    );
    const { data: conversations } = useFirestoreCollectionData(conversationsQuery, { idField: "id" });
    const [feedback, setFeedback] = React.useState("");
    const [feedbackIndex, setFeedbackIndex] = React.useState(0);
    const [feedbackRecipient, setFeedbackRecipient] = React.useState("");
    const { enqueueSnackbar } = useSnackbar();

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const onFeedbackSubmit = () => {
        handleClose();
        if (
            feedback.length < 10
        ) {
            enqueueSnackbar("Feedback must be at least 10 characters long",
                { variant: "error" });
            return;
        }

        const newData = conversations[0].conversation;
        newData[feedbackIndex].feedback = {
            text: feedback,
            recipient: feedbackRecipient,
        };
        // If all validation went well, update the doc
        setDoc(doc(firestore, "conversations", conversations[0].id), {
            updatedAt: serverTimestamp(),
            conversation: newData,
        }, { merge: true }).then(() => {
            const link = `https://console.cloud.google.com/firestore/data/conversations/${conversations[0].id}?project=${firestore.app.options.projectId}`;
            log("onFeedbackSubmit:success, visit",
                link
            );
            enqueueSnackbar("Success, link copied to clipboard", { variant: "success" });
            navigator.clipboard.writeText(link);
        }).catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        });
    };

    const onFeedbackDelete = (player: "1" | "both" | "2", index: number) => {
        const newData = conversations[0].conversation;
        newData[index].feedback = {
            text: "",
            recipient: player,
        };
        setDoc(doc(firestore, "conversations", conversations[0].id), {
            updatedAt: serverTimestamp(),
            conversation: newData,
        }, { merge: true }).then(() => {
            enqueueSnackbar("Success", { variant: "success" });
        }).catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        });
    };

    if (!conversations) {
        return <CenteredCircularProgress />;
    }
    return (

        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            padding={10}
        >
            {/* show left and right arrow as floating action button in bottom left */}
            <Fab
                color="success"
                sx={{
                    position: "fixed",
                    bottom: "50%",
                    left: (theme) => theme.spacing(4)
                }}
            >
                <ArrowLeft />
            </Fab>
            <Fab
                color="success"
                sx={{
                    position: "fixed",
                    bottom: "50%",
                    right: (theme) => theme.spacing(4)
                }}
            >
                <ArrowRight />
            </Fab>
            <h1>Conversation Assistance</h1>
            <Typography
                variant="caption"
                gutterBottom
            >
                This is a tool to simulate a conversation assistance,
                the data is then used to create artificial intelligence
                that repeat this assistance during real conversations.
            </Typography>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    What&apos;s your feedback for {feedbackRecipient}?
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Feedback"
                        fullWidth
                        variant="standard"
                        value={feedback}
                        onChange={(e) => {
                            setFeedback(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        // center children
                        justifyContent: "center",
                    }}
                >
                    <Button onClick={onFeedbackSubmit}
                        variant="outlined"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Grid
                    item
                >
                    <Tooltip title={"Represents the first person in the conversation"}>
                        <span>
                            <Chip
                                color="info"
                                label={"First"} />
                        </span>
                    </Tooltip>
                </Grid>
                <Grid
                    item
                >
                    <Tooltip title={"Represents both persons in the conversation"}>
                        <span>
                            <Chip
                                label={"Both"} />
                        </span>
                    </Tooltip>
                </Grid>
                <Grid
                    item
                >
                    <Tooltip title={"Represents the second person in the conversation"}>
                        <span>
                            <Chip
                                color="warning"
                                label={"Second"}
                            />
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
            <List
                sx={{
                    mb: 0, overflow: "auto",
                }}>
                {conversations[0]?.conversation.map((c: any, index: number) => (
                    <div key={index}
                        style={{
                            borderBottom: "1px solid #e0e0e0",
                            padding: "10px 0",
                            // center children
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // column
                            flexDirection: "column",
                        }}

                    >
                        <ListItem
                            sx={{
                                width: "70%",
                                justifyContent: "center",
                                textAlign: "center",
                            }}
                        >
                            <ListItemText primary={c.text}
                                sx={{
                                    color: index % 2 === 0 ? "info.main" : "warning.main",
                                }}
                            />
                        </ListItem>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={20}
                        >
                            <Grid
                                item
                            >
                                <Tooltip title={conversations[0].conversation[index].feedback.text &&
                                    conversations[0].conversation[index].feedback.recipient === "1" ?
                                    conversations[0].conversation[index].feedback.text : "No feedback yet"}>
                                    <span>
                                        <Chip
                                            color="info"
                                            label={conversations[0].conversation[index].feedback.text &&
                                                conversations[0].conversation[index].feedback.recipient === "1" ?
                                                "feedback" : "N/A"}
                                            onClick={() => {
                                                setFeedbackIndex(index);
                                                setFeedbackRecipient("1");
                                                setOpen(true);
                                            }}
                                            onDelete={
                                                conversations[0].conversation[index].feedback.text &&
                                                    conversations[0].conversation[index].feedback.recipient === "1" ?
                                                    () => onFeedbackDelete("1", index) : undefined} />
                                    </span>
                                </Tooltip>
                            </Grid>
                            <Grid
                                item
                            >
                                <Tooltip title={conversations[0].conversation[index].feedback.text &&
                                    conversations[0].conversation[index].feedback.recipient === "both" ?
                                    conversations[0].conversation[index].feedback.text : "No feedback yet"}>
                                    <span>
                                        <Chip
                                            label={conversations[0].conversation[index].feedback.text &&
                                                conversations[0].conversation[index].feedback.recipient === "both" ?
                                                "feedback" : "N/A"}
                                            onClick={() => {
                                                setFeedbackIndex(index);
                                                setFeedbackRecipient("both");
                                                setOpen(true);
                                            }}
                                            onDelete={
                                                conversations[0].conversation[index].feedback.text &&
                                                    conversations[0].conversation[index].feedback.recipient === "both" ?
                                                    () => onFeedbackDelete("both", index) : undefined
                                            } />
                                    </span>
                                </Tooltip>
                            </Grid>
                            <Grid
                                item
                            >
                                <Tooltip title={conversations[0].conversation[index].feedback.text &&
                                    conversations[0].conversation[index].feedback.recipient === "2" ?
                                    conversations[0].conversation[index].feedback.text : "No feedback yet"}>
                                    <span>
                                        <Chip
                                            color="warning"
                                            label={conversations[0].conversation[index].feedback.text &&
                                                conversations[0].conversation[index].feedback.recipient === "2" ?
                                                "feedback" : "N/A"}
                                            onClick={() => {
                                                setFeedbackIndex(index);
                                                setFeedbackRecipient("2");
                                                setOpen(true);
                                            }}
                                            onDelete={
                                                conversations[0].conversation[index].feedback.text &&
                                                    conversations[0].conversation[index].feedback.recipient === "2" ?
                                                    () => onFeedbackDelete("2", index) : undefined} />
                                    </span>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </div>
                ))}

            </List>
        </Grid>
    );
}
