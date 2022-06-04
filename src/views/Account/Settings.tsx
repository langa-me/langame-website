import { Add, HelpOutline, Warning } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { addDoc, collection, doc, query, setDoc, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import CenteredCircularProgress from "../../components/elements/CenteredCircularProgress";
import { log } from "../../utils/logs";
import notionIcon from "../../assets/images/notion.png";
import { isLocal } from "../../utils/constants";
import { useQuery } from "../../utils/route";
import { useEffect } from "react";

const clientId = "7ca77f41-5128-476e-a25d-2331a3daa4ee";
const redirectUri = isLocal ?
    "http%3A%2F%2Flocalhost%3A3000%2Faccount%2Fsettings" :
    "https%3A%2F%2Flanga.me%3A3000%2Faccount%2Fsettings";


export default function AccountSettings() {
    const fs = useFirestore();
    const user = useUser();
    const q = useQuery();
    const [organizationName, setOrganizationName] = React.useState("");
    const { enqueueSnackbar } = useSnackbar();
    const organizationsCollection = collection(fs, "organizations");
    const configsCollection = collection(fs, "configs");
    const organizationsQuery = query(organizationsCollection,
        where("members", "array-contains", user.data?.uid));
    const { status, data: organizations } = useFirestoreCollectionData(organizationsQuery, {
        idField: "id",
    });
    const configsQuery = query(configsCollection, 
        where("guild_id", "==", 
        organizations && organizations.length > 0 ?
        organizations[0].id :
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    ));
    const { data: configs } = useFirestoreCollectionData(configsQuery, {
        idField: "id",
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [notionIsLoading, setNotionIsLoading] = React.useState(false);
    const [notionCode, setNotionCode] = React.useState("");
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
        
        log("created new organization", newOrganizationDoc);
        enqueueSnackbar("Created new organization", { variant: "success" });
        setIsLoading(false);
    };
    const connectToNotion = async () => {
        const url = "https://api.notion.com/v1/oauth/authorize?"+
        `owner=user&client_id=${clientId}`+
        `&redirect_uri=${redirectUri}&response_type=code`;
        window.open(url, "_self");
    };

    useEffect(() => {
        if (configs && configs.length > 0 && configs[0].notion) return;
        if (q.get("code")) {
            setNotionCode(q.get("code")!);
        }
        if (configs &&
            configs.length > 0 &&
            notionCode) {
            setNotionIsLoading(true);
            setDoc(doc(
                configsCollection,
                configs[0].id,
            ), {
                notion: {
                    code: notionCode,
                    // write the redirect uri decoded
                    redirect_uri: decodeURIComponent(redirectUri),
                },
            }, { merge: true })
            .catch((e) => {
                console.log("error", e);
                enqueueSnackbar("Error connecting to Notion", { variant: "error" });
            })
            .then(() => enqueueSnackbar("Connected to Notion", { variant: "success" }))
            .finally(() => setNotionIsLoading(false));
        }
    }, [configs, q]);

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
            <Typography
          variant="h3"
          >
          Account Settings
          </Typography>
          <Divider />
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
            {
                configs &&
                configs.length > 0 &&
                configs[0].guild_id &&
                <Stack
                    direction="row"
                >
                    <Tooltip title={
                        configs &&
                        configs.length > 0 &&
                        configs[0].notion?.error ?
                        configs[0].notion.error :
                        ""
                    }>
                        <span>
                            <LoadingButton
                                startIcon={<img 
                                    style={{
                                        width: "20%",
                                    }}
                                    src={notionIcon} alt="notion" />}
                                endIcon={
                                    configs &&
                                    configs.length > 0 &&
                                    configs[0].notion?.error &&
                                    <Warning />
                                }
                                onClick={connectToNotion}
                                loading={notionIsLoading}
                                disabled={
                                    !configs ||
                                    configs.length === 0 ||
                                    (
                                        configs[0].notion !== undefined &&
                                        configs[0].notion?.error === undefined
                                    )
                                }
                                color={
                                    configs &&
                                    configs.length > 0 &&
                                    configs[0].notion !== undefined ?
                                    "success" :
                                    "primary"
                                }
                                sx={{
                                    "width": "60%",
                                    ".MuiButton-startIcon": {
                                        width: "40%",
                                    }
                                }}
                            >
                                Connect to Notion
                            </LoadingButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="What do I get from connecting Langame with Notion?">
                        <IconButton
                            onClick={() => {
                                // go to help.langa.me/langame-in-notion
                                window.open(
                                    "https://help.langa.me/langame-in-notion", 
                                    "_blank",
                                    "noopener,noreferrer",
                                );
                            }}
                        >
                            <HelpOutline/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            }
        </Stack>
    );
}
