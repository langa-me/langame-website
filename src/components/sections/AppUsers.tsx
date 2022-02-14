import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, doc, limit, orderBy, query } from "firebase/firestore";
import * as React from "react";
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from "reactfire";
import CenteredCircularProgress from "../elements/CenteredCircularProgress";

export default function AppUsers(
    { style }: React.PropsWithChildren<{ style?: React.CSSProperties }>
) {
    const firestore = useFirestore();
    const usersCollection = collection(firestore, "users");
    const preferencesCollection = collection(firestore, "preferences");
    const usersQuery = query(usersCollection,
        orderBy("lastSpent", "desc"),
        limit(20), // TODO: pagination
    );

    const { data: users } = useFirestoreCollectionData(usersQuery, { idField: "id" });
    const preferencesDocs = users.map((user) => doc(preferencesCollection, user.id));
    const preferences = preferencesDocs.map((doc) =>
        useFirestoreDocData(doc, { idField: "id" })).map((e) => e?.data);
    if (!users) {
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
                style={style}
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
