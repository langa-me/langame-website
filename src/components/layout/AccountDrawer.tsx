import { AttachMoney, BarChart, Key, Settings, ThumbsUpDown } from "@mui/icons-material";
import { Divider, ListItemButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { collection, doc, query, where } from "firebase/firestore";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from "reactfire";
import CenteredCircularProgress from "../elements/CenteredCircularProgress";
interface AccountDrawerProps {
  topAnchor: any;
}
export default function AccountDrawer({ topAnchor }: AccountDrawerProps) {
  const history = useHistory();
  const firestore = useFirestore();
  const user = useUser();
  const organizationsCollection = collection(firestore, "organizations");
  const organizationsQuery = query(organizationsCollection,
    where("members", "array-contains", user.data?.uid));
  const { status, data: organizations } = useFirestoreCollectionData(organizationsQuery, {
    idField: "id",
  });
  const userObs = useFirestoreDocData(doc(firestore, "users", user?.data?.uid || ""));

  if (status === "loading") {
    return <CenteredCircularProgress />;
  }
  return (
    <nav
      style={{
        top: topAnchor,
        position: "absolute",
        width: "20%",
        zIndex: 1,
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              history.push("/account/settings");
            }}
          >
            <ListItemIcon>
              <Settings
                color="success"
              />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        {
          // Don't show if no organizations created yet
          organizations.length > 0 &&
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  history.push("/account/api-keys");
                }}
              >
                <ListItemIcon>
                  <Key
                    color="success"
                  />
                </ListItemIcon>
                <ListItemText primary="API keys" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  history.push("/account/usage");
                }}
              >
                <ListItemIcon>
                  <BarChart
                    color="success"
                  />
                </ListItemIcon>
                <ListItemText primary="Usage" />
              </ListItemButton>
            </ListItem>
          </>
        }
        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              window.open("https://help.langa.me/langame-services/pricing", "_blank");
            }}
          >
            <ListItemIcon>
              <AttachMoney
                color="success"
              />
            </ListItemIcon>
            <ListItemText primary="Pricing" />
          </ListItemButton>
        </ListItem>
        {userObs.data?.role === "admin" &&
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                // go to /confirm
                history.push("/confirm");
              }}
            >
              <ListItemIcon>
                <ThumbsUpDown
                  color="success"
                />
              </ListItemIcon>
              <ListItemText primary="Conversation starters" />
            </ListItemButton>
          </ListItem>
        }
      </List>
    </nav>
  );
}
