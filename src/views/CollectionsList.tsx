
import { Delete, Edit } from "@mui/icons-material";
import { Chip, Divider, IconButton, List, ListItem, ListItemText, Stack, TextField } from "@mui/material";
import { collection, doc, query, setDoc, where, writeBatch } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React from "react";
import { useHistory } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import CreateCollectionButton from "../components/elements/CreateCollectionButton";
import { usePreferences } from "../contexts/usePreferences";




export default function CollectionsList() {
    const firestore = useFirestore();
    const preferences = usePreferences();
    const {data: user} = useUser();
    const history = useHistory();
    const playlistsCollection = collection(firestore, "playlists");
    const playlistsQuery = query(playlistsCollection,
        // where("topics", "array-contains-any",
        //     topics && topics.length > 0 ? topics : ["%"]),
        // where("disabled", "==", false),
        where("uid", "==", user?.uid || "%"),
        where("like", "==", true),
    );
    const { data: playlists } = useFirestoreCollectionData(playlistsQuery, { idField: "id" });
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Stack
            spacing={4}
        >
            <List
            >
                {
                preferences
                ?.collections
                ?.filter((c: any) => c.name && c.id)
                ?.map((c: any) => (
                    <ListItem key={c.id}
                        divider
                        secondaryAction={
                            <Stack
                                direction="row"
                            >
                            <IconButton
                                onClick={() => {
                                    if (playlists
                                        ?.filter((playlist) => 
                                        playlist.collection === c.id).length === 0) {
                                        enqueueSnackbar("Empty collection, add some conversation starters first", { variant: "info" });
                                        return;
                                    }
                                    history.push(`/account/collections/${c.id}`);
                                }}>
                                <Edit/>
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    const batch = writeBatch(firestore);
                                    batch.set(doc(collection(firestore, "preferences"), user?.uid), {
                                        collections: preferences?.collections
                                            .filter((cc: any) => c.id !== cc.id)
                                    }, {merge: true});
                                    playlists
                                        .filter((playlist) => playlist.collection === c.id)
                                        .map((p) => batch.delete(doc(playlistsCollection, p.id)));

                                    batch.commit()
                                    .then(() => enqueueSnackbar("Deleted " + c.name, { variant: "success" }))
                                    .catch((err) => {
                                        enqueueSnackbar(err.message, { variant: "error" });
                                    });
                                }}
                            >
                                <Delete/>
                            </IconButton>
                            </Stack>
                        }
                    >
                        <Stack>
                            <Chip
                                sx={{
                                    margin: "0.5em",
                                    width: "40px",
                                }}
                                label={playlists
                                    ?.filter((playlist) => playlist.collection === c.id).length}
                            />
                            <ListItemText primary={
                                <TextField
                                    fullWidth
                                    sx={{
                                        width: "80%",
                                    }}
                                    value={c.name}
                                    inputProps={{ maxLength: 12 }}
                                    onChange={(e) => {
                                        const cn = preferences?.collections;
                                        cn.forEach((cc: any) => {
                                            if (cc.id === c.id) {
                                                cc.name = e.target.value;
                                            }
                                        });
                                        setDoc(doc(collection(firestore, "preferences"), user?.uid), {
                                            collections: cn
                                        }, {merge: true});
                                    }}
                                />
                            }/>
                            <List
                                sx={{
                                    // padding: "0.2em",
                                    display: "flex",
                                    flexDirection: "row",
                                    // width: "50%",
                                    maxHeight: "100%", 
                                    overflow: "auto",
                                    // hide scroll bar
                                    "&::-webkit-scrollbar": {
                                        display: "none",
                                    },
                                }}
                            >
                                {
                                    playlists &&
                                    [
                                        ...new Set(playlists
                                        .filter((playlist) => playlist.collection === c.id)
                                        .map((playlist) => playlist.topics)
                                        .flat())
                                    ]
                                    ?.map((topic: any, i: number) => 
                                        <Chip key={i}  label={topic} />
                                    )

                                }
                            </List>
                        </Stack>
                    </ListItem>
                    
                ))}
                <CreateCollectionButton/>
            </List>
            <Divider />
        </Stack>
    )
}