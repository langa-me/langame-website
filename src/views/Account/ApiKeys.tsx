import { Divider, Stack, Typography } from "@mui/material";
import { collection, doc } from "firebase/firestore";
import * as React from "react";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import ApiKeysTable from "../../components/elements/ApiKeysTable";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";




export default function ApiKeys() {
    const user = useUser();
    const firestore = useFirestore();
    const preferencesCollection = collection(firestore, "preferences");
    const preferenceDoc = doc(preferencesCollection, user.data?.uid || "undefined");
    const { status, data: preferences } = useFirestoreDocData(preferenceDoc, {
        idField: "id",
    });
    if (status === "loading") {
        return <CenteredCircularProgress />;
    }
    return (
        <React.Fragment>
            <Stack
                spacing={4}
                alignContent="center"
                justifyContent="center"
                alignItems="center"
            >
                <Typography
                    variant="h6"
                >
                    API keys
                </Typography>
                <Divider />
                <p>
                    Your secret API keys are shown below. Do not share your API key with others,
                    or expose it in the browser or other client-side code.
                    In order to protect the security of your account. <a href="https://docs.langa.me"
                        target="_blank" rel="noopener noreferrer"
                    >See documentation</a>
                </p>
                <ApiKeysTable
                    organizationId={preferences.currentOrganization}
                />
            </Stack>
        </React.Fragment>
    );
}
