import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { collection, orderBy, query } from "firebase/firestore";
import * as React from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "../elements/CenteredCircularProgress";


export default function SocialIntegrationUsers(
    { style }: React.PropsWithChildren<{ style?: React.CSSProperties }>
) {
    const firestore = useFirestore();
    const socialInteractionsCollection = collection(firestore, "social_interactions");
    const socialInteractionsQuery = query(socialInteractionsCollection,
        orderBy("created_at", "desc"),
        // limit(20), // TODO: pagination
    );
    const { data: socialInteractions } = useFirestoreCollectionData(socialInteractionsQuery, {
        idField: "id",
    });
    const discordUsersCollection = collection(firestore, "discord_users");
    const discordUsersQuery = query(discordUsersCollection);
    const { data: discordUsers } = useFirestoreCollectionData(discordUsersQuery, {
        idField: "id",
    });
    // group socialInteractions by "guild_id"
    // and count interactions per guild
    const discordGuilds = socialInteractions?.reduce((acc, e) => {
        const guildId = e.guild_id;
        if (guildId) {
            if (!acc[guildId]) {
                acc[guildId] = {
                    guild_id: guildId,
                    interactionsCount: 0,
                };
            } else if (!acc[guildId].name) {
                acc[guildId] = {
                    ...acc[guildId],
                    ...discordUsers?.find((e) => e.id === guildId)
                }
            }
            acc[guildId].interactionsCount++;
        }
        return acc;
    }, {} as { [guild_id: string]: any[] });

    if (!discordGuilds) {
        return <CenteredCircularProgress />;
    }
    return (
        <div style={style}>
            <Typography
                variant="h6"
            >
                Discord Guilds
            </Typography>
            <DataGrid
                autoHeight
                pageSize={5}
                rowsPerPageOptions={[5]}
                rows={Object.entries(discordGuilds).map(([k, v]) => ({
                    id: k,
                    name: v.name,
                    description: v.description,
                    interactionsCount: v.interactionsCount,
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
                        width: 150,
                        type: "string",
                    },
                    {
                        headerName: "Description",
                        field: "description",
                        width: 200,
                        type: "string",
                    },
                    {
                        headerName: "Number of interactions",
                        field: "interactionsCount",
                        width: 200,
                        type: "number",
                    },
                ]}
            />
        </div>

    );
}
