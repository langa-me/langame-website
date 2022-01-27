import * as React from "react";
import { addDoc, collection, doc, query, setDoc, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { log } from "../../utils/logs";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { Tooltip, Button, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";

export default function AccountSettings() {
    const fs = useFirestore();
    const user = useUser();
    const [organizationName, setOrganizationName] = React.useState("");
    const { enqueueSnackbar } = useSnackbar();
    const organizationsCollection = collection(fs, "organizations");
    const preferencesCollection = collection(fs, "preferences");
    const preferencesDoc = doc(preferencesCollection, user.data?.uid);
    const organizationsQuery = query(organizationsCollection,
        where("members", "array-contains", user.data?.uid));
    const { status, data: organizations } = useFirestoreCollectionData(organizationsQuery, {
        idField: "id",
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const createOrganization = async () => {
        setIsLoading(true);
        // Create a new organization for the user
        const newOrganization = {
            name: organizationName,
            members: [user.data!.uid],
            membersRole: {
                [user.data!.uid]: "owner"
            }
        };
        const newOrganizationDoc = await addDoc(organizationsCollection, newOrganization);
        // Update preferences for the user (might have a b2c account)
        await setDoc(preferencesDoc, {
            currentOrganization: newOrganizationDoc.id
        }, { merge: true });
        log("created new organization", newOrganizationDoc);
        enqueueSnackbar("Created new organization", { variant: "success" });
        setIsLoading(false);
    };

    if (isLoading || status === "loading") {
        return <CenteredCircularProgress />;
    }
    return (
        <Stack
            spacing={4}
            sx={{
                backgroundColor: "background",
                width: "50%",
            }}
        >
            <h3>Account Settings</h3>
            <TextField
                label="Organization Name"
                value={organizations.length > 0 ?
                    organizations[0].name :
                    organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                disabled={organizations.length > 0}
            />
            {
                organizations.length === 0 &&
                <Tooltip
                    followCursor={true}
                    title={organizationName.length < 3 ?
                        "Organization name must be at least 3 characters long" :
                        "Create a new organization"}
                >
                    <span>
                        <Button
                            startIcon={<Add />}
                            onClick={createOrganization}
                            disabled={organizationName.length < 3 ||
                                organizationName.length > 12
                            }
                        >
                            Create Organization
                        </Button>
                    </span>
                </Tooltip>
            }
        </Stack>
    );
}
