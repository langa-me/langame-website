import { ContentCopy } from "@mui/icons-material";
import { IconButton, InputAdornment, Paper, Skeleton, Stack, TextField } from "@mui/material";
import React from "react";
import TagsAutocomplete from "./TagsAutocomplete";




export interface ConversationStarter {
    id: string
    content: string
    topics: string[]
}

// eslint-disable-next-line no-unused-vars
type ContentChange = (content: string) => void
// eslint-disable-next-line no-unused-vars
export type TopicChange = (topics: string[]) => void
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
                                            <ContentCopy />
                                        </IconButton>
                                    </InputAdornment>,
                                }}
                            /> :
                            <Skeleton
                                variant="rectangular"
                                height="5em"
                            />
                    }
                    <TagsAutocomplete
                        conversationStarterTopics={conversationStarter?.topics || []}
                        setConversationStarterTopics={(topics) =>
                            setConversationStarter ? setConversationStarter({
                                ...conversationStarter!,
                                topics: topics,
                            }) :
                                onTopicsChange ? onTopicsChange(topics) : () => { }
                        }
                    />
                </Stack>
            </Paper>
        </React.Fragment>
    );
}