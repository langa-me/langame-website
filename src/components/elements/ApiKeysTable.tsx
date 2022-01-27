import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import CenteredCircularProgress from "./CenteredCircularProgress";
import { addDoc, collection, deleteDoc, doc, DocumentData, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { Button, CircularProgress, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add, ContentCopy, Delete, SentimentSatisfied } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { isProd } from "../../utils/constants";


interface ApiKeysProps {
    organizationId: string;
}
const apiUrl = `https://${isProd ? "" : "d"}api.langa.me/v1/conversation/starter`;
export default function ApiKeysTable({ organizationId }: ApiKeysProps) {
    const firestore = useFirestore();
    const apiKeysCollection = collection(firestore, "api_keys");
    const apiKeysQuery = query(apiKeysCollection, where("owner", "==", organizationId));
    const { status, data: keys } = useFirestoreCollectionData(apiKeysQuery, {
        idField: "id",
    });
    const [canAct, setCanAct] = React.useState(false);
    const [topicsQueryTry, setTopicsQueryTry] = React.useState("ice breaker,travel");
    const [queryResponse, setQueryResponse] = React.useState<any>(null);
    const { enqueueSnackbar } = useSnackbar();

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
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": keys[0].apiKey,
            },
            body: JSON.stringify({
                topics: topicsQueryTry.split(",").map((e) => e.trim()),
            })
        }).then((e) => e.json()).then((e) => {
            setQueryResponse(e);
        }).catch((e) => {
            enqueueSnackbar(e.message, { variant: "error" });
            setQueryResponse(null);
        });
    };
    const onCopyRequestAsCurlToClipboard = () => {
        const curl = `curl -X POST -H "Content-Type: application/json" -H "X-Api-Key: ${keys[0].apiKey}" -d '{"topics": [${topicsQueryTry.split(",").map((e) => `"${e.trim()}"`).join(", ")}]}' ${apiUrl} | jq '.'`;
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
                        <TableCell>
                            {row.id}
                        </TableCell>
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
                        <TableCell>{row.lastSpent?.toDate().toLocaleDateString("en-US")}</TableCell>
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
                    minWidth: 300,

                }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>SECRET KEY ID</TableCell>
                            <TableCell>SECRET KEY VALUE</TableCell>
                            <TableCell>CREATED</TableCell>
                            <TableCell>LAST USED</TableCell>
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

            <TextField
                label="Try now!"
                placeholder="ice breaker,travel"
                value={topicsQueryTry}
                onChange={(e) => setTopicsQueryTry(e.target.value)}
            />
            {/* Row with 2 buttons */}
            <Grid
                container
                spacing={2}
                justifyContent="space-around"
            >
                <Grid item>

                    <Tooltip title={
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
                                    !canAct
                                    || topicsQueryTry.split(",").some((e) => e.trim().length < 3)
                                }
                            >
                                Copy as cURL
                            </Button>
                        </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title={
                        "Coming soon"
                    }
                        followCursor={true}
                    >
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<SentimentSatisfied />}
                                onClick={onExecuteRequestToApi}
                                disabled={true}
                            >
                                Execute
                            </Button>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
            {
                queryResponse &&
                <Typography>{queryResponse}</Typography>
            }
        </Stack>
    );
}