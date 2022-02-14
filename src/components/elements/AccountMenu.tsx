import { AccountCircle, Check } from "@mui/icons-material";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { ListItemText, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { signOut } from "firebase/auth";
import { collection, doc, query, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useAuth, useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from "reactfire";
import { log } from "../../utils/logs";

export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const auth = useAuth();
    const user = useUser();
    // get all organizations names i'm in
    const firestore = useFirestore();
    const organizationsCollection = collection(firestore, "organizations");
    const organizationsQuery = query(organizationsCollection,
        where("members", "array-contains", user.data?.uid || "undefined"));
    const { status, data: organizations } = useFirestoreCollectionData(organizationsQuery, {
        idField: "id",
    });
    const preferencesCollection = collection(firestore, "preferences");
    const preferenceDoc = doc(preferencesCollection, user.data?.uid || "undefined");
    const prefObs = useFirestoreDocData(preferenceDoc, {
        idField: "id",
    });
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            log("signed out");
            enqueueSnackbar("Signed out", { variant: "success" });

        }).catch((error) => {
            // An error happened.
            log("error signing out", error);
            enqueueSnackbar(error.message, { variant: "error" });
        });
    }

    return (
        <React.Fragment>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <AccountCircle
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: "\"\"",
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {status != "loading" && organizations.map((e) => {
                    return (
                        <MenuItem key={e.id}>
                            {prefObs.data?.currentOrganization === e.id &&
                                <ListItemIcon>
                                    <Check fontSize="small" />
                                </ListItemIcon>}
                            <ListItemText>{e.name}</ListItemText>
                        </MenuItem>
                    );
                })}
                <Divider />
                <MenuItem
                    onClick={() => {
                        window.location.href = "/account/settings";
                    }}
                    sx={{
                        fontSize: 18
                    }}
                    color="primary"
                >
                    <ListItemIcon

                    >
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem
                    onClick={onLogout}
                    sx={{
                        fontSize: 18
                    }}
                >
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment >
    );
}
