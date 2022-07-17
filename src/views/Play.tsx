
import { ContentCopy, SentimentSatisfied } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Chip, Divider, IconButton, InputAdornment, List, Paper, Skeleton, Stack, TextField, Tooltip } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import StarterFeedbackButtons from "../components/elements/StarterFeedbackButtons";
import TagsAutocomplete from "../components/elements/TagsAutocomplete";
import { usePreferences } from "../contexts/usePreferences";
import { langameApiUrl } from "../utils/constants";

interface ConversationStarter {
    id: string
    content: string
    topics: string[]
}

interface ConversationStarterProps {
    conversationStarter: ConversationStarter | undefined
    setConversationStarter: React.Dispatch<React.SetStateAction<ConversationStarter | undefined>>
}
/**
 *
 * @param {ConversationStarterProps} props 
 * @return 
 */
function ConversationStarterTextfield({
    conversationStarter, setConversationStarter
}: ConversationStarterProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                padding: "3rem 0",
            }}
        >
            <Stack
                alignContent="center"
                justifyContent="center"
                alignItems="center"
                spacing={4}
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
                        onChange={(e) => setConversationStarter({
                            ...conversationStarter,
                            content: e.target.value
                        })}
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
                    }}
                >
                {
                    conversationStarter?.topics?.map((topic: string) => (
                        <Chip key={topic} label={topic}
                            sx={{
                                marginTop: "0.5rem",
                            }}
                            onDelete={() => {
                                setConversationStarter({
                                    ...conversationStarter,
                                    topics: conversationStarter?.topics.filter((e) => e !== topic)});
                            }}
                        />
                    ))
                }
                </List>
            </Stack>
        </Paper>
    );
}

export default function Play() {
    const firestore = useFirestore();
    const preferences = usePreferences();
    const {data: user} = useUser();
    const apiKeysCollection = collection(firestore, "api_keys");
    const apiKeysQuery = query(apiKeysCollection, where("owner", "==", 
        preferences?.currentOrganization || "%"
    ));
    const { data: keys } = useFirestoreCollectionData(apiKeysQuery, {
        idField: "id",
    });
    const memesCollection = collection(firestore, "memes");
    const [autocompleteTopics, setAutocompleteTopics] = React.useState<string[]>([]);
    const memesQuery = query(memesCollection,
        where("topics", "array-contains-any", 
            autocompleteTopics && autocompleteTopics.length > 0 ? autocompleteTopics : ["%"]),
        where("disabled", "==", false),
        where("confirmed", "==", true),
        // TODO: inefficient
        // limit(10),
    );
    const { data: memes } = useFirestoreCollectionData(memesQuery, { idField: "id" });
    const playlistsCollection = collection(firestore, "playlists");
    const playlistsQuery = query(playlistsCollection,
        where("topics", "array-contains-any",
            autocompleteTopics && autocompleteTopics.length > 0 ? autocompleteTopics : ["%"]),
        where("disabled", "==", false),
        where("uid", "==", user?.uid || "%"),
    );
    const { data: playlists } = useFirestoreCollectionData(playlistsQuery, { idField: "id" });
    const newMemes = memes?.filter((e) => 
        e.content &&
        !(playlists?.map((p) => p.memeId) || []).includes(e.id))
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = React.useState(false);
    const [queryResponse, setQueryResponse] = React.useState<{
        limit: number,
        translation: boolean,
        results: any[]
    }>();
    const [currentConversationIndex, setCurrentConversationIndex] = React.useState<number>(0);
    const [currentMeme, setCurrentMeme] = React.useState<ConversationStarter>();

    useEffect(() =>  {
    if (!newMemes || 
        currentConversationIndex >= newMemes.length ||
        !newMemes[currentConversationIndex].content ||
        newMemes[currentConversationIndex].id  === currentMeme?.id
    ) return;
    setCurrentMeme({
        id: newMemes[currentConversationIndex].id,
        content: newMemes[currentConversationIndex].content,
        topics: newMemes[currentConversationIndex].topics
    });
    }, [currentConversationIndex, newMemes]);
    useEffect(() => setCurrentConversationIndex(0), [memes]);
    const onExecuteRequestToApi = () => {
        setLoading(true);
        const h  = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": keys[0].apiKey,
            },
            body: JSON.stringify({
                topics: autocompleteTopics.map((e) => e.trim()),
            }),
        };
        fetch(langameApiUrl, h).then((e) => e.json()).then((e) => {
            setQueryResponse(e);
            setCurrentMeme(e.results[0].content);
        }).catch((e) => {
            enqueueSnackbar(e.message, { variant: "error" });
            setQueryResponse(undefined);
            setCurrentMeme(undefined);
        }).finally(() => setLoading(false));
    };

    return (
        <React.Fragment>
        <Stack
            spacing={4}
            alignContent="center"
            justifyContent="center"
            alignItems="center"
            direction="column"
        >
            <TagsAutocomplete
                conversationStarterTopics={autocompleteTopics}
                setConversationStarterTopics={setAutocompleteTopics}
            />
            
            <Paper
                sx={{
                    margin: "2em",
                    width: "90%",
                }}
            >
            <Carousel
                showThumbs={false}
                width={
                    window.innerWidth > 600 ?
                    "100%" :
                    "300px"
                }
                onChange={(e) =>
                    setCurrentConversationIndex(
                        e
                    )}
            >
                {
                    queryResponse &&
                    "results" in queryResponse &&
                    queryResponse.results.length > 0 ?
                    queryResponse.results
                    .filter((e) => "conversation_starter" in e && "en" in e.conversation_starter)
                    .map((item, i) => <ConversationStarterTextfield key={i}
                        conversationStarter={currentMeme}
                        setConversationStarter={setCurrentMeme}
                    />
                    ) :
                    newMemes
                    ?.slice(0, 5)
                    ?.map((item, i) => <ConversationStarterTextfield key={i}
                        conversationStarter={currentMeme}
                        setConversationStarter={setCurrentMeme}
                    />
                    )
                }
            </Carousel>
            </Paper>
            <Divider />
            {
                currentMeme &&
                    <StarterFeedbackButtons
                        disabled={loading ? "disabled" : undefined}
                        conversationStarterId={
                            currentMeme.id
                        }
                        conversationStarterText={
                            currentMeme.content
                        }
                        conversationStarterTopics={
                            currentMeme.topics
                        }
                        onClick={() => {
                            setQueryResponse(undefined);
                        }}
                    />
            }
            <Tooltip 
                title={
                    autocompleteTopics.length === 0 ?
                    "Please select at least one topic" :
                    loading ?
                    "Creating a new conversation starter..." :
                    "Create a new conversation starter using Langame AI"
            }>
                <span>
                    <LoadingButton
                            disabled={autocompleteTopics.length === 0}
                            loading={loading}
                            onClick={onExecuteRequestToApi}
                            startIcon={<SentimentSatisfied />}
                        >
                            Create
                    </LoadingButton>
                </span>
            </Tooltip>
        </Stack>
        </React.Fragment>
    )
}
