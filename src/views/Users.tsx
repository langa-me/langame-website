import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import ApiUsers from "../components/sections/ApiUsers";
import AppUsers from "../components/sections/AppUsers";
import SocialIntegrationUsers from "../components/sections/SocialIntegrationUsers";


export const Users = () => {
    const [tabIndex, setTabIndex] = React.useState(0);
    return (
        // show list on the left to pick between "app,api,social integrations"
        <>
            <List
                style={{
                    top: 100,
                    position: "absolute",
                    width: "20%",
                    zIndex: 1,
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                    margin: "20px",
                }}
            >
                {
                    ["App", "API", "Social integrations"].map((e, i) => (
                        <ListItem
                            key={i}
                            disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setTabIndex(i);
                                }}
                            >
                                <ListItemText primary={e} />
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
            <Box sx={{
                marginTop: "10%",
                marginLeft: "20%",
                padding: "0px 20px",
                // center children
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",

            }}>
                {
                    tabIndex === 0 ?
                        <AppUsers
                            style={{
                                width: "90%",
                                height: 400,
                            }}
                        /> :
                        tabIndex === 1 ?
                            <ApiUsers
                                style={{
                                    width: "90%",
                                    height: 400,
                                }}
                            /> :
                            <SocialIntegrationUsers
                                style={{
                                    width: "90%",
                                    height: 400,
                                }}
                            />
                }
            </Box >
        </>

    );
}
