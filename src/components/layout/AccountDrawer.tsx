import { BarChart, Collections, Key, Logout, Menu, Mood, Payment, People, QuestionAnswer, Settings, ThumbsUpDown } from "@mui/icons-material";
import { AppBar, Box, Divider, Drawer, IconButton, ListItemButton, Stack, Toolbar, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { signOut } from "firebase/auth";
import { collection, doc, query, where } from "firebase/firestore";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreCollectionData, useFirestoreDocData, useUser } from "reactfire";
import CenteredCircularProgress from "../elements/CenteredCircularProgress";
import Logo from "./partials/Logo";
interface AccountDrawerProps {
  children: React.ReactNode;
}

export const drawerWidth = 240;
export default function AccountDrawer({ children }: AccountDrawerProps) {
  const navigate = useNavigate();
  const firestore = useFirestore();
  const user = useUser();
  const auth = useAuth();
  const organizationsCollection = collection(firestore, "organizations");
  const organizationsQuery = query(organizationsCollection,
    where("members", "array-contains", user.data?.uid ||
      "%"
    ));
  const { status, data: organizations } = useFirestoreCollectionData(organizationsQuery, {
    idField: "id",
  });
  const { data: userData } = useFirestoreDocData(doc(firestore, "users", user?.data?.uid || "%"));
  const container = window !== undefined ? () => window.document.body : undefined;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  if (status === "loading") {
    return <CenteredCircularProgress />;
  }
  const bo = (
    <React.Fragment>
      <Toolbar />
      <Divider />
      <List>
        {
          // Don't show if no organizations created yet
          organizations.length > 0 &&
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/account/play");
                }}
              >
                <ListItemIcon>
                  <Mood
                    color="success"
                  />
                </ListItemIcon>
                <ListItemText primary="Play" />
              </ListItemButton>
            </ListItem>
          </>
        }
        {
          // Don't show if no organizations created yet
          organizations.length > 0 &&
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/account/collections");
                }}
              >
                <ListItemIcon>
                  <Collections
                    color="success"
                  />
                </ListItemIcon>
                <ListItemText primary="Collection" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/account/settings");
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
            </>
        }
        {
          // Don't show if no organizations created yet
          organizations.length > 0 &&
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/account/api-keys");
                }}
              >
                <ListItemIcon>
                  <Key
                    color="success"
                  />
                </ListItemIcon>
                <ListItemText primary="Develop" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/account/usage");
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
            {
              userData?.discord &&
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/account/conversations");
                  }}
                >
                  <ListItemIcon>
                    <QuestionAnswer
                      color="success"
                    />
                  </ListItemIcon>
                  {window.innerWidth > 768 && <ListItemText primary="Conversations" />}
                </ListItemButton>
              </ListItem>
            }
            {
              false &&
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/account/billing");
                  }}
                >
                  <ListItemIcon>
                    <Payment
                      color="success"
                    />
                  </ListItemIcon>
                  {window.innerWidth > 768 && <ListItemText primary="Billing" />}
                </ListItemButton>
              </ListItem>
            }
          </>
        }
        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              signOut(auth).then(() => {
                navigate("/");
              });
            }}
          >
            <ListItemIcon>
              <Logout
                color="error"
              />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ListItem>
        {userData?.role === "admin" &&
          <Divider textAlign="left">Admin</Divider>
        }
        {userData?.role === "admin" &&
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/admin/conversation/starter");
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
        {userData?.role === "admin" &&
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate("/admin/users");
              }}
            >
              <ListItemIcon>
                <People
                  color="success"
                />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
        }
      </List>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: "primary",
          }}
        >
          <Toolbar
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <Menu />
            </IconButton>
            <Stack
              direction="row"
              spacing={4}
            >
              <Logo className={undefined} />
              <Typography variant="h6" noWrap component="div">
                Langame
              </Typography>
            </Stack>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {bo}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
            open
          >
            {bo}

          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >

          <Toolbar />
          {children}
        </Box>
      </Box>
    </React.Fragment>
  );
}
