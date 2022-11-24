import { ContentCopy, OpenInFull } from "@mui/icons-material";
import { Chip, IconButton, List, Paper, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { ConversationStarter } from "./ConversationStarter";



interface PresentConversationStarterDialogProps {
    conversationStarter: ConversationStarter;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PresentConversationStarterDialog({
    conversationStarter, open, setOpen
}: PresentConversationStarterDialogProps) {
    const [fullscreen, setFullscreen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
        setFullscreen(false);
    };

    return (
        <Dialog
            fullScreen={fullscreen}
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            sx={{
                "& .MuiDialog-paper": {
                    height: !fullscreen ? "90%" : undefined,
                },
                "& .MuiPaper-root": {
                    backgroundColor: "grey.800",
                }
            }}
        >
            <DialogTitle>
                <List
                    sx={{
                        padding: "0.5em",
                    }}
                    subheader={
                        <Typography variant="h6">
                            Topics
                        </Typography>
                    }
                >
                    {conversationStarter.topics.map((e) => <Chip key={e} label={e} />)}
                </List>
            </DialogTitle>
            <DialogContent
                // align center vertically
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper
                    sx={{
                        padding: "4rem 2rem",

                    }}
                    elevation={5}
                >
                    <DialogContentText
                        color="textPrimary"
                        // align center
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        {conversationStarter.content}
                    </DialogContentText>
                </Paper>
            </DialogContent>
            <DialogActions>
                <IconButton
                    // copy to clipboard
                    onClick={() => window.navigator.clipboard.writeText(conversationStarter.content)}
                >
                    <ContentCopy />
                </IconButton>
                <IconButton
                    onClick={() => setFullscreen(!fullscreen)}
                >
                    <OpenInFull />
                </IconButton>
            </DialogActions>
        </Dialog>
    );
}
