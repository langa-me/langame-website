import { AttachMoney } from "@mui/icons-material";
import { Chip, Divider, FormControl, InputLabel,
    MenuItem, Select, Stack, Typography } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import * as React from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";
import UsagePerKeyChart from "../../components/elements/UsagePerKeyChart";


export default function Usage() {
    const user = useUser();
    const firestore = useFirestore();
    const organizationsCollection = collection(firestore, "organizations");
    const apiKeysCollection = collection(firestore, "api_keys");
    const organizationsQuerySnapshot = useFirestoreCollectionData(
        query(organizationsCollection,
            where("members", "array-contains", user.data?.uid)
        ), {
        idField: "id",
    });
    const apiKeysQuerySnapshot = useFirestoreCollectionData(
        query(apiKeysCollection,
            where("owner", "==", organizationsQuerySnapshot.data ?
                organizationsQuerySnapshot.data[0].id :
                null)
        ), {
        idField: "id",
    });
    const [selectedKey, setSelectedKey] = React.useState<string | null>(
        apiKeysQuerySnapshot.data &&
            apiKeysQuerySnapshot.data.length > 0 &&
            apiKeysQuerySnapshot.data[0].id ?
            apiKeysQuerySnapshot.data[0].id :
            null
    );

    if (Object.keys(apiKeysQuerySnapshot).length === 0) {
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
            Usage
          </Typography>
          <Divider />
            {
                organizationsQuerySnapshot.data &&
                organizationsQuerySnapshot.data.length > 0 &&
                <Stack
                    direction="row"
                    spacing={4}
                >
                    <Typography>Credits</Typography>
                    <Chip icon={<AttachMoney />}
                        label={organizationsQuerySnapshot.data[0].credits} />
                </Stack>
            }

            <FormControl fullWidth>
                <InputLabel>Key</InputLabel>
                <Select
                    value={selectedKey || ""}
                    label="Key"
                    onChange={(e) => setSelectedKey(e.target.value as string)}
                >
                    {
                        apiKeysQuerySnapshot.data?.map((key) =>
                            <MenuItem key={key.id} value={key.id}>{key.id}</MenuItem>)
                    }
                </Select>
            </FormControl>

            {selectedKey && <UsagePerKeyChart
                keyId={selectedKey}
            />}
        </Stack>
        </React.Fragment>
    );
}
