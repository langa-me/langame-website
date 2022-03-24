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
    const {status, data: preferences} = useFirestoreDocData(preferenceDoc, {
      idField: "id",
    });
    if (status === "loading") {
        return <CenteredCircularProgress />;
    }
    return (
        <Stack
            sx={{
                width: "70%",
            }}
            spacing={4}
        >
            <Typography
          variant="h3"
          >
          API keys
          </Typography>
          <Divider />
            <p>
                Your secret API keys are shown below. Do not share your API key with others,
                or expose it in the browser or other client-side code.
                In order to protect the security of your account.
            </p>
            <ApiKeysTable
                organizationId={preferences.currentOrganization}
            />
        </Stack>
    );
}
