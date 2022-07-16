import { Add, ContentCopy, Delete, SentimentSatisfied } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, CircularProgress, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { addDoc, collection, deleteDoc, doc, DocumentData, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { langameApiUrl } from "../../utils/constants";
import CenteredCircularProgress from "./CenteredCircularProgress";
import TagsAutocomplete from "./TagsAutocomplete";


interface ApiKeysProps {
    organizationId: string;
}
export default function ApiKeysTable({ organizationId }: ApiKeysProps) {
    const firestore = useFirestore();
    const apiKeysCollection = collection(firestore, "api_keys");
    const apiKeysQuery = query(apiKeysCollection, where("owner", "==", organizationId));
    const { status, data: keys } = useFirestoreCollectionData(apiKeysQuery, {
        idField: "id",
    });
    const [canAct, setCanAct] = React.useState(false);
    const [queryResponse, setQueryResponse] = React.useState<any>(null);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = React.useState(false);
    const [topics, setTopics] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (!canAct) setTimeout(() => setCanAct(true), 4000);
    }, [canAct]);

    const onCreateKey = () => {
        setCanAct(false);
        const onFail = (err: any) =>
            enqueueSnackbar(err.message, { variant: "error" });
        addDoc(apiKeysCollection, {
            owner: organizationId,
            createdAt: serverTimestamp(),
        }).then((e) => {
            // wait until the document has an "apiKey" property
            // created by the back-end
            return new Promise((resolve, reject) => {
                let timeout: any;
                const unsubscribe = onSnapshot(e, (snapshot) => {
                    if (snapshot.data()?.apiKey) {
                        unsubscribe();
                        clearTimeout(timeout);
                        enqueueSnackbar("New API key created", { variant: "success" });
                        resolve(undefined);
                    }
                });
                timeout = setTimeout(() => {
                    unsubscribe();
                    deleteDoc(e);
                    reject({ message: "Unfortunately, the key could not be created" });
                }, 10_000);
            });
        }).catch(onFail);
    };
    const onDeleteKey = (keyId: string) => {
        setCanAct(false);
        const onFail = (err: any) =>
            enqueueSnackbar(err.message, { variant: "error" });
        deleteDoc(doc(apiKeysCollection, keyId))
            .then(() => enqueueSnackbar("API key deleted", { variant: "success" }))
            .catch(onFail);
    };
    const onExecuteRequestToApi = () => {
        setLoading(true);
        const h  = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": keys[0].apiKey,
            },
            body: JSON.stringify({
                topics: topics.map((e) => e.trim()),
            }),
        };
        fetch(langameApiUrl, h).then((e) => e.json()).then((e) => {
            setQueryResponse(e);
        }).catch((e) => {
            enqueueSnackbar(e.message, { variant: "error" });
            setQueryResponse(null);
        }).finally(() => setLoading(false));
    };
    const onCopyRequestAsCurlToClipboard = () => {
        const curl = `curl -X POST -H "Content-Type: application/json" -H "X-Api-Key: ${keys[0].apiKey}" -d '{"topics": [${topics.map((e) => `"${e.trim()}"`).join(", ")}]}' ${langameApiUrl} | jq '.'`;
        navigator.clipboard.writeText(curl).then(() => {
            enqueueSnackbar("Copied to clipboard", { variant: "success" });
        }).catch((e) => {
            enqueueSnackbar(e.message, { variant: "error" });
        });
    };
    if (status === "loading") {
        return <CenteredCircularProgress />;
    }
    const keyRow = (row: DocumentData) => (
        <TableRow
            key={row.id}
        >
            {
                row.apiKey ?
                    <>
                        <TableCell

                        >
                            {row.apiKey?.slice(0, 3) +
                                row.apiKey?.slice(3, 6)
                                    .replace(/./g, "*")
                            } <IconButton
                                onClick={() => {
                                    // copy to clipboard
                                    navigator.clipboard.writeText(row.apiKey);
                                    enqueueSnackbar("Copied to clipboard", { variant: "success" });
                                }}
                            >
                                <ContentCopy />
                            </IconButton>
                        </TableCell>
                        <TableCell>
                            {row.createdAt?.toDate().toLocaleDateString("en-US")}
                        </TableCell>
                        <TableCell>
                            <IconButton
                                onClick={() => onDeleteKey(row.id)}
                                disabled={!canAct}
                            >
                                <Delete />
                            </IconButton>
                        </TableCell>
                    </> :
                    <TableCell>
                        <CircularProgress />
                    </TableCell>
            }
        </TableRow>
    );
    return (
        <React.Fragment>
        <Stack
            spacing={6}
        >
            <TableContainer component={Paper}
                color="primary"
                sx={{
                    padding: "1rem",
                }}
            >
                <Table sx={{
                    minWidth: 200,
                }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>SECRET KEY VALUE</TableCell>
                            <TableCell>CREATED</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                    >
                        {keys.map(keyRow)}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={onCreateKey}
                disabled={!canAct}
            >
                Create new API key
            </Button>

            <TagsAutocomplete
                conversationStarterTopics={topics}
                setConversationStarterTopics={setTopics}
            />
            {
                queryResponse &&
                "results" in queryResponse &&
                queryResponse.results.length > 0 &&
                "conversation_starter" in queryResponse.results[0] &&
                "en" in queryResponse.results[0].conversation_starter &&
                <Paper>
                    <Typography variant="h6">
                    {
                        queryResponse.results[0].conversation_starter.en
                    }
                    </Typography>
                </Paper>
            }
            {/* Row with 2 buttons */}
            <Grid
                container
                spacing={2}
                justifyContent="space-around"
            >
                <Grid item>

                    <Tooltip title={
                        keys.length === 0 ?
                        "You need to create an API key first" :
                        "Try the API with a cURL request."
                    }
                        followCursor={true}
                    >
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<ContentCopy />}
                                onClick={onCopyRequestAsCurlToClipboard}
                                disabled={
                                    keys.length === 0 ||
                                    !canAct
                                }
                            >
                                Copy as cURL
                            </Button>
                        </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={
                        ""
                    }
                        followCursor={true}
                    >
                        <span>
                            <LoadingButton
                                variant="outlined"
                                startIcon={<SentimentSatisfied />}
                                onClick={onExecuteRequestToApi}
                                loading={loading}
                                disabled={false}
                            >
                                Execute
                            </LoadingButton>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
        </Stack>
        </React.Fragment>
    );
}