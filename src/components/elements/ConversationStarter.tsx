import { ContentCopy } from "@mui/icons-material";
import { Chip, IconButton, InputAdornment, List, Paper, Skeleton, Stack, TextField } from "@mui/material";
import React from "react";



export interface ConversationStarter {
    id: string
    content: string
    topics: string[]
}

// eslint-disable-next-line no-unused-vars
type ContentChange = (content: string) => void
// eslint-disable-next-line no-unused-vars
type TopicChange = (topics: string[]) => void
interface ConversationStarterProps {
    conversationStarter: ConversationStarter | undefined
    setConversationStarter?: React.Dispatch<React.SetStateAction<ConversationStarter | undefined>>
    onContentChange?: ContentChange
    onTopicsChange?: TopicChange
    width?: number | string
}
/**
 *
 * @param {ConversationStarterProps} props 
 * @return 
 */
export default function ConversationStarterTextfield({
    conversationStarter, setConversationStarter, onContentChange, onTopicsChange, width,
}: ConversationStarterProps) {
    return (
        <React.Fragment>
            <Paper
                elevation={3}
                sx={{
                    padding: "2rem 0",
                    width: width || "90%",
                }}
            >
                <Stack
                    alignContent="center"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0}
                >
                    {
                        conversationStarter && conversationStarter.content ?
                        <TextField
                            fullWidth
                            multiline
                            sx={{
                                width: "80%"
                            }}
                            value={conversationStarter.content}
                            onChange={(e) => {
                                setConversationStarter && setConversationStarter({
                                    ...conversationStarter,
                                    content: e.target.value
                                })
                                onContentChange && onContentChange(e.target.value)
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                <IconButton
                                    // copy to clipboard
                                    onClick={() => conversationStarter!.content &&
                                        window.navigator.clipboard.writeText(conversationStarter!.content)}
                                >
                                    <ContentCopy/>
                                </IconButton>
                                </InputAdornment>,
                            }}
                        /> :
                        <Skeleton
                            variant="rectangular"
                            height="5em"
                        />
                    }
                    <List
                        sx={{
                            padding: "0.2em",
                            width: "50%",
                            // scrollable
                            overflow: "auto",
                            maxHeight: "10em",
                            textAlign: "center",
                        }}
                    >
                    {
                        conversationStarter?.topics?.map((topic: string) => (
                            <Chip key={topic} label={topic}
                                sx={{
                                    marginTop: "0.5rem",
                                }}
                                onDelete={() => {
                                    setConversationStarter && setConversationStarter({
                                        ...conversationStarter,
                                        topics: conversationStarter?.topics.filter((e) => e !== topic)}
                                    );
                                    onTopicsChange && onTopicsChange(conversationStarter?.topics.filter((e) => e !== topic))
                                }}
                            />
                        ))
                    }
                    </List>
                </Stack>
            </Paper>
        </React.Fragment>
    );
}