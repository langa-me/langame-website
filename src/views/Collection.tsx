
import { Delete } from "@mui/icons-material";
import { Divider, IconButton, List, ListItem, Stack } from "@mui/material";
import { collection, deleteDoc, doc, query, setDoc, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import ConversationStarterTextfield, { ConversationStarter } from "../components/elements/ConversationStarter";




export default function Collection() {
    const firestore = useFirestore();
    const { data: user } = useUser();
    const navigate = useNavigate();
    const param = useParams<{ userId?: string; collection: string }>();
    const playlistsCollection = collection(firestore, "playlists");
    const playlistsQuery = query(playlistsCollection,
        where("collection", "==", param.collection),
        where("disabled", "==", false),
        where("uid", "==", user?.uid || param.userId || "%"),
        where("like", "==", true),
    );
    const { data: playlists } = useFirestoreCollectionData(playlistsQuery, { idField: "id" });
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (!playlists) return;
        // if playlist empty, return to /account/collections
        if (playlists.length !== 0) return;
        navigate("/account/collections");
    }, [navigate, playlists]);
    return (
        <Stack
            spacing={4}
        >
            <List>
                {playlists?.map((playlist) => (
                    <ListItem
                        alignItems="center"
                        key={playlist.id}
                        secondaryAction={
                            <IconButton
                                onClick={() => {
                                    deleteDoc(doc(playlistsCollection, playlist.id))
                                        .then(() => enqueueSnackbar("Deleted", { variant: "success" }))
                                        .catch((err) => {
                                            enqueueSnackbar(err.message, { variant: "error" });
                                        });
                                }}
                            >
                                <Delete />
                            </IconButton>
                        }
                    >
                        <ConversationStarterTextfield
                            conversationStarter={playlist as ConversationStarter}
                            onContentChange={(content) => {
                                setDoc(doc(collection(firestore, "playlists"), playlist.id), {
                                    content: content,
                                }, { merge: true });
                            }}
                            onTopicsChange={(topics) => {
                                setDoc(doc(collection(firestore, "playlists"), playlist.id), {
                                    topics: topics,
                                }, { merge: true });
                            }}
                        />
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Stack>
    )
}
