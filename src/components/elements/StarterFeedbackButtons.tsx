
import * as React from "react";

import { Check, Clear } from "@mui/icons-material";
import { ButtonGroup, IconButton, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useFirestore, useUser } from "reactfire";
import { usePreferences } from "../../contexts/usePreferences";
import CreateCollectionButton from "./CreateCollectionButton";

// user can't name more than 12 characters anyway
const hackDeleteCollection = "%%%%%%%%%%%%%%%%%%";
export interface StarterFeedbackButtonsProps {
    conversationStarterId: string
    conversationStarterText: string
    conversationStarterTopics: string[]
    onClick?: () => void
    disabled?: string
}

const StarterFeedbackButtons = ({
    conversationStarterId,
    conversationStarterText,
    conversationStarterTopics,
    onClick,
    disabled,
}: StarterFeedbackButtonsProps) => {
    const {data: user} = useUser();
    const firestore = useFirestore();
    const playlistsCollection = collection(firestore, "playlists");
    const preferences = usePreferences();
    const {enqueueSnackbar} = useSnackbar();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onLike = (collection: string) => {
        setLoading(true);

        // If all validation went well, update the meme and set disabled to false
        addDoc(playlistsCollection, {
            memeId: conversationStarterId,
            disabled: false,
            content: conversationStarterText,
            topics: conversationStarterTopics,
            confirmed: true,
            uid: user?.uid,
            like: collection !== hackDeleteCollection,
            updatedAt: serverTimestamp(),
            collection: collection,
        })
        .then(() => {
            enqueueSnackbar("Saved", { variant: "default" });
            setOpen(false);
        })
        .catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        }).finally(() => {
            setLoading(false);
            onClick && onClick();
        });
    };
  
    return (
        <React.Fragment>
            <Dialog
                fullWidth
                open={open}>
                <DialogTitle>Add to a collection</DialogTitle>
                <List sx={{ pt: 0 }}>
                    {
                        preferences?.collections?.map((collection: any) => (
                            <ListItem button 
                                onClick={() => onLike(collection.id)} key={collection.id}>
                                <ListItemText primary={collection.name} />
                            </ListItem>
                        ))
                    }
                    <CreateCollectionButton/>
                </List>
            </Dialog>
            <ButtonGroup
                variant="text" aria-label="text button group"
                sx={{
                    // align child center
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <Tooltip title="I don't like this conversation starter">
                    <span>
                    <IconButton
                        onClick={() => onLike(hackDeleteCollection)}
                        disabled={loading || disabled !== undefined}
                    >
                        <Clear />
                    </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Save this conversation starter">
                <span>
                    <IconButton
                        onClick={() => setOpen(true)}
                        disabled={loading || disabled !== undefined}
                    >
                        <Check />
                    </IconButton>
                    </span>
                </Tooltip>
        </ButtonGroup>
    </React.Fragment>
    );
};

export default StarterFeedbackButtons;
