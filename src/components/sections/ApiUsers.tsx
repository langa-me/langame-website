import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, query } from "firebase/firestore";
import * as React from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "../elements/CenteredCircularProgress";



export default function ApiUsers(
    { style }: React.PropsWithChildren<{ style?: React.CSSProperties }>
) {
    const firestore = useFirestore();
    const organizationsCollection = collection(firestore, "organizations");
    const organizationsQuery = query(organizationsCollection);
    const { data: organizations } = useFirestoreCollectionData(organizationsQuery, {
        idField: "id",
    });

    const usagesCollection = collection(firestore, "usages");
    const usagesQuery = query(usagesCollection);
    const { data: usages } = useFirestoreCollectionData(usagesQuery, {
        idField: "id",
    });

    if (!organizations || !usages) {
        return <CenteredCircularProgress />;
    }
    return (
        <div style={style}>
            <Typography
                variant="h6"
            >
                Organizations
            </Typography>
            <DataGrid
                autoHeight
                pageSize={5}
                rowsPerPageOptions={[5]}
                rows={organizations.map((e) => ({
                    id: e.id,
                    name: e.name,
                    totalCalls: usages.find((u) => e.members.includes(u.id))?.queries?.length || 0,
                }))}
                columns={[
                    {
                        headerName: "Id",
                        field: "id",
                        width: 200,
                        type: "string",
                    },
                    {
                        headerName: "Name",
                        field: "name",
                        width: 100,
                        type: "string",
                    },
                    {
                        headerName: "Total calls",
                        field: "totalCalls",
                        width: 200,
                        type: "number",
                    },
                ]}
            />
        </div>
    );
}
