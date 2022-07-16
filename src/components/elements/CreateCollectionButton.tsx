import { IconButton, ListItem } from "@mui/material";
import { Add } from "@mui/icons-material";
import { collection, doc, setDoc } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React from "react";
import { useFirestore, useUser } from "reactfire";
import { usePreferences } from "../../contexts/usePreferences";


const CreateCollectionButton = () => {
    const firestore = useFirestore();
    const preferences = usePreferences();
    const {data: user} = useUser();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = React.useState(false);
    const createCollection = () => {
        setLoading(true);
        const collectionRef = collection(firestore, "collections");

        // Generate "locally" a new document for the given collection reference
        const docRef = doc(collectionRef); 

        // Get the new document Id
        const documentUuid = docRef.id;
        setDoc(doc(collection(firestore, "preferences"), user?.uid), {
            collections: [...(preferences?.collections || []), {
                name: "New Collection",
                id: documentUuid,
            }],
        }, {merge: true}).catch((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
        }).finally(() => setLoading(false));
    };

    return (
        <ListItem
            sx={{
                justifyContent: "center",
            }}
            button
            onClick={createCollection}
            disabled={loading}
        >
            <IconButton
                color="primary"
                onClick={createCollection}
                disabled={loading}
            >
                <Add/>
            </IconButton>
        </ListItem>
    )
};

export default CreateCollectionButton;
