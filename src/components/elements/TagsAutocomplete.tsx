import { History, Mood } from "@mui/icons-material";
import { Autocomplete, Button, Chip, List, Paper, Stack, TextField } from "@mui/material";
import { collection, query, setDoc, doc } from "firebase/firestore";
import React from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { usePreferences } from "../../contexts/usePreferences";
import { TopicChange } from "./ConversationStarter";

interface TagsAutocompleteProps {
    conversationStarterTopics: string[]
    setConversationStarterTopics: TopicChange
    height?: number | string
    helpers?: boolean
}
export default function TagsAutocomplete({
    conversationStarterTopics, setConversationStarterTopics, height, helpers,
}: TagsAutocompleteProps) {
    const firestore = useFirestore();
    const { data: user } = useUser();
    const preferences = usePreferences();
    const topicsCollection = collection(firestore, "topics");
    const topicsQuery = query(topicsCollection)
    const { data: topics } = useFirestoreCollectionData(topicsQuery, { idField: "id" });
    return (
        <React.Fragment>
            <Stack
                alignContent="center"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                direction="column"
                width="85%"
                sx={{
                    margin: "5px",
                }}
            >
                {
                    helpers &&
                    <Stack
                        alignContent="center"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        direction="row"
                    >
                        <Paper
                            sx={{
                                width: "100%",
                                height: height || "8em",
                            }}
                        >
                            <List
                                sx={{
                                    padding: "0.5em",
                                }}
                                subheader={
                                    <Paper>
                                        <Button
                                            disabled
                                            startIcon={<Mood
                                                sx={{
                                                    margin: "0.5em",
                                                }}
                                            />}
                                        >
                                            Popular topics
                                        </Button>
                                    </Paper>
                                }
                            >
                                {
                                    [
                                        "ice breaker",
                                        "big talk",
                                        "personal development",
                                        "love"
                                    ].map((topic: string, i: number) =>
                                        <Chip key={i} label={topic}
                                            onClick={() => {
                                                setConversationStarterTopics([topic]);
                                            }}
                                            sx={{
                                                margin: "0.1rem",
                                            }}
                                        />
                                    )
                                }
                            </List>
                        </Paper>
                        {
                            window.innerWidth > 600 &&
                            <Paper
                                sx={{
                                    width: "100%",
                                    height: height || "8em",
                                }}
                            >
                                <List
                                    sx={{
                                        padding: "0.5em",
                                    }}
                                    subheader={
                                        <Paper>
                                            <Button
                                                disabled
                                                startIcon={<History
                                                    sx={{
                                                        margin: "0.5em",
                                                    }}
                                                />}
                                            >
                                                History
                                            </Button>
                                        </Paper>
                                    }
                                >
                                    {
                                        preferences?.history?.map((h: any, i: number) =>
                                            <Chip key={i} label={h.topic}
                                                onDelete={() => {
                                                    setDoc(doc(collection(firestore, "preferences"), user?.uid), {
                                                        history: preferences?.history?.filter((hh: any) => hh.topic !== h.topic)
                                                    }, { merge: true });
                                                }}
                                                onClick={() => {
                                                    setConversationStarterTopics([h.topic]);
                                                }}
                                                sx={{
                                                    margin: "0.1rem",
                                                }}
                                            />
                                        )
                                    }
                                </List>
                            </Paper>
                        }
                    </Stack>
                }
                <Autocomplete
                    fullWidth
                    freeSolo
                    multiple
                    id="tags-outlined"
                    options={topics?.map((e) => e.id) || []}
                    loading={!topics}
                    getOptionLabel={(option) => option}
                    value={conversationStarterTopics}
                    filterSelectedOptions
                    popupIcon={<></>}
                    onChange={(e, value) => {
                        if (value.length > 11) return;
                        const hasRemoved = conversationStarterTopics.filter((t) => !value.includes(t)).length > 0;
                        setConversationStarterTopics(value);
                        if (!value || hasRemoved) return;
                        let history = preferences?.history;
                        if (!history) history = [];
                        value.forEach((t) => {
                            // if present in history already skip
                            if (history?.find((h: any) => h.topic === t)) return;
                            history?.push({ topic: t });
                        });
                        // max 10 history, remove firsts
                        while (history?.length > 4) history = history?.slice(1);
                        setDoc(doc(collection(firestore, "preferences"), user?.uid), {
                            history: history,
                        }, { merge: true });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Topics"
                            placeholder="ice breaker"
                            error={
                                conversationStarterTopics.length > 10
                            }
                            helperText={
                                conversationStarterTopics.length > 10
                                    ? "You can only select up to 10 topics"
                                    : ""
                            }
                        />
                    )}
                />
            </Stack>
        </React.Fragment>
    )
}