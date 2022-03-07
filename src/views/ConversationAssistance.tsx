import { Tooltip } from "@material-ui/core";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Button, ButtonGroup, Chip, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, DocumentData, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "../components/elements/CenteredCircularProgress";

function useForceUpdate() {
    const setValue = useState(0)[1]; // integer state
    return () => setValue((v) => v + 1); // update the state to force render
}
export const ConversationAssistance = () => {
    const firestore = useFirestore();
    const conversationsCollection = collection(firestore, "conversations");
    const [conversationDoc, setConversationDoc] = 
        React.useState<DocumentData | undefined>(undefined);
    const { enqueueSnackbar } = useSnackbar();
    const forceUpdate = useForceUpdate();
    const conversationsQuery = query(conversationsCollection,
        where("confirmed", "==", false),
        limit(1),
    );
    const { data: conversations } = 
        useFirestoreCollectionData(conversationsQuery, { idField: "id" });
    const [textFields, setTextFields] = React.useState<string[]>(["","",""]);
    useEffect(() => {
        if (conversations && conversations.length > 0) {
            setConversationDoc(conversations[0]);
        }
    }, [conversations]);
    useEffect(() => {
        if (conversationDoc) {
            setTextFields(conversationDoc.conversation.map((e: any) => e.content));
        }
    }, [conversationDoc]);
    const onDelete = () => {
        const link = `https://console.cloud.google.com/firestore/data/deleted_conversations/${conversationDoc!.id}?project=${firestore.app.options.projectId}`;
        deleteDoc(doc(firestore, "conversations", conversationDoc!.id)).then(() => {
            enqueueSnackbar("Success", { variant: "success" });
            forceUpdate();
        }).catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        });
        setDoc(doc(firestore, "deleted_conversations", conversationDoc!.id), conversationDoc, { merge: true }).then(() => {
            enqueueSnackbar("Success, link copied to clipboard", { variant: "success" });
            navigator.clipboard.writeText(link);
        }).catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        });
    };
    const onSkip = () => {

    };
    const onConfirm = () => {
        const c = conversationDoc!.conversation.map((e: any, i: number) => ({
            ...e,
            content: textFields[i],
        }));
        const link = `https://console.cloud.google.com/firestore/data/conversations/${conversationDoc!.id}?project=${firestore.app.options.projectId}`;

        setDoc(doc(collection(firestore, "conversations"), conversationDoc!.id), { 
            confirmed: true,
            updatedAt: serverTimestamp(),
            conversation: c,
        }, { merge: true })
        .then(() => {
            enqueueSnackbar("Success, link copied to clipboard", { variant: "success" });
            navigator.clipboard.writeText(link);
            forceUpdate();
        }).catch(() => {
            enqueueSnackbar("Error confirming conversation", { variant: "error" });
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
            
            <h1>Conversation Assistance</h1>
            <Typography
                variant="caption"
                gutterBottom
            >
                This is a tool to simulate a conversation assistance,
                the data is then used to create artificial intelligence
                that repeat this assistance during real conversations.
            </Typography>
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
                    width: "100%",
                }}>
                {conversationDoc?.conversation.map((c: any, index: number) => (
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
                                width: "90%",
                                justifyContent: "center",
                                textAlign: "center",
                            }}
                        >
                            
                            <TextField 
                                multiline   
                                variant="outlined"
                                fullWidth
                                value={textFields[index]}
                                onChange={(e) => {
                                    const newTextFields = [...textFields];
                                    newTextFields[index] = e.target.value;
                                    setTextFields(newTextFields);
                                }}
                                color={index % 2 === 0 ? "info" : "warning"}
                            />
                        </ListItem>
                    </div>
                ))}

            </List>
            <Grid
            item
            >
                <ButtonGroup
                        variant="text" aria-label="text button group"
                        sx={{
                            // align center
                            justifyContent: "center",

                        }}
                    >
                        <Tooltip title="Bad conversation">
                            <Button
                                onClick={onDelete}
                                startIcon={<ArrowBackIos />}
                            >
                                Delete
                            </Button>
                        </Tooltip>
                        <Tooltip title="I don't know">
                            <Button
                                onClick={onSkip}
                            >
                                Skip
                            </Button>
                        </Tooltip>
                        <Tooltip title="Good conversation">
                            <Button
                                onClick={onConfirm}
                                endIcon={<ArrowForwardIos />}
                            >
                                Confirm
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                    </Grid>
        </Grid>
    );
}
