import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from "@mui/material";
import { collection, limit, orderBy, query } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "../components/elements/CenteredCircularProgress";



export const Users = () => {
    const firestore = useFirestore();
    const usersCollection = collection(firestore, "users");
    const usersQuery = query(usersCollection,
        orderBy("lastSpent", "desc"),
        limit(20), // TODO: pagination
    );
    const { data: users } = useFirestoreCollectionData(usersQuery, { idField: "id" });
    const { enqueueSnackbar } = useSnackbar();

    if (!users) {
        return <CenteredCircularProgress />;
    }
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            marginTop="10%"
        >
            <Grid item>
                <List>
                    {users
                        // order by user.lastSignInTime
                        .sort((a: any, b: any) => {
                            if (a.lastSpent.toDate() > b.lastSpent.toDate()) {
                                return -1;
                            }
                            if (a.lastSpent.toDate() < b.lastSpent.toDate()) {
                                return 1;
                            }
                            return 0;
                        })
                        .map(user => (
                            <Tooltip
                                key={user.id}
                                title={"Last login: " + user.lastSpent.toDate().toLocaleString()}>
                                <ListItem key={user.id}
                                    onClick={() => {
                                        // copy tag to clipboard
                                        navigator.clipboard.writeText(user.tag);
                                        enqueueSnackbar("Tag copied to clipboard", { variant: "success" });
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar alt={user.displayName} src={user.photoUrl} />
                                    </ListItemAvatar>

                                    <ListItemText
                                        secondary={user.email}
                                        primary={user.tag}

                                    />

                                </ListItem>
                            </Tooltip>
                        ))}
                </List>
            </Grid>
        </Grid >
    );
}
