import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, limit, orderBy, query } from "firebase/firestore";
import * as React from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "../elements/CenteredCircularProgress";

export default function AppUsers(
    { style }: React.PropsWithChildren<{ style?: React.CSSProperties }>
) {
    const firestore = useFirestore();
    const usersCollection = collection(firestore, "users");
    const usersQuery = query(usersCollection,
        orderBy("lastSpent", "desc"),
        limit(20), // TODO: pagination
    );

    const { data: users } = useFirestoreCollectionData(usersQuery, { idField: "id" });

    const preferencesCollection = collection(firestore, "preferences");
    const preferencesQuery = query(preferencesCollection,
    );

    const { data: preferences } = useFirestoreCollectionData(preferencesQuery, { idField: "id" });
    if (!users || !preferences) {
        return <CenteredCircularProgress />;
    }
    return (
        <div style={style}>
            <Typography
                variant="h6"
            >
                App users
            </Typography>
            <DataGrid
                autoHeight
                pageSize={5}
                rowsPerPageOptions={[5]}
                rows={users.map((e) => ({
                    id: e.id,
                    lastSpent: e.lastSpent.toDate().toLocaleString(),
                    tag: e.tag,
                    favoriteTopics: preferences?.find((p) => p && e && p.id === e.id)?.favoriteTopics,
                    email: e.email,
                    displayName: e.displayName,
                }))}
                columns={[
                    {
                        headerName: "Id",
                        field: "id",
                        width: 200,
                        type: "string",
                    },
                    {
                        headerName: "Last interacted",
                        field: "lastSpent",
                        width: 200,
                        type: "date",
                    },
                    {
                        headerName: "Tag",
                        field: "tag",
                        width: 200,
                        type: "string",
                    },
                    {
                        headerName: "Favorite topics",
                        field: "favoriteTopics",
                        width: 200,
                        type: "array",
                        resizable: true,
                    },
                    {
                        headerName: "Email",
                        field: "email",
                        width: 200,
                        type: "string",
                    },
                    {
                        headerName: "Display name",
                        field: "displayName",
                        width: 200,
                        type: "string",
                    },
                ]}
            />
        </div>
    );
}
