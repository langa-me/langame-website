
import { ContentCopy, Delete } from "@mui/icons-material";
import { Chip, Divider, IconButton, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from "@mui/material";
import { collection, deleteDoc, doc, query, setDoc, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";


export default function Collection() {
    const firestore = useFirestore();
    const {data: user} = useUser();
    const history = useHistory();
    const param = useParams<{collection: string}>();
    const playlistsCollection = collection(firestore, "playlists");
    const playlistsQuery = query(playlistsCollection,
        where("collection", "==", param.collection),
        where("disabled", "==", false),
        where("uid", "==", user?.uid || "%"),
        where("like", "==", true),
    );
    const { data: playlists } = useFirestoreCollectionData(playlistsQuery, { idField: "id" });
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        if (!playlists) return;
        // if playlist empty, return to /account/collections
        if (playlists.length !== 0) return;
        history.push("/account/collections");
    }, [playlists]);
    return (
        <Stack
            spacing={4}
        >
            <List>
                {playlists?.map((playlist) => (
                    <ListItem key={playlist.id}
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
                                <Delete/>
                            </IconButton>
                        }
                    >
                        <ListItemText primary={
                            <TextField 
                                value={playlist.content}
                                inputProps={{ maxLength: 120 }}
                                onChange={(e) => {
                                    setDoc(doc(collection(firestore, "playlists"), playlist.id), {
                                        content: e.target.value,
                                    }, {merge: true});
                                }}
                                multiline
                                // rows={3}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    width: "80%",
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                      <IconButton
                                        // copy to clipboard
                                        onClick={() => window.navigator.clipboard.writeText(playlist.content)}
                                      >
                                        <ContentCopy/>
                                      </IconButton>
                                    </InputAdornment>,
                                }}
                                />
                        } 
                            secondary={
                                    playlist.topics.map((topic: string) => (
                                        <Chip key={topic} label={topic}
                                            sx={{
                                                marginTop: "0.5rem",
                                            }}
                                            onDelete={() => {
                                                setDoc(doc(collection(firestore, "playlists"), playlist.id), {
                                                    topics: playlist.topics.filter((t: string) => t !== topic),
                                                }, {merge: true});
                                            }}
                                        />
                                    ))
                            }
                        />
                        
                    </ListItem>
                ))}
            </List>
            <Divider />
        </Stack>
    )
}
