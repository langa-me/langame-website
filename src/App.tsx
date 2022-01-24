import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useRef } from "react";
import { Redirect, Switch, useLocation } from "react-router-dom";
import {
  AuthProvider, FirebaseAppProvider, FirestoreProvider,
} from "reactfire";
// Layouts
import LayoutDefault from "./layouts/LayoutDefault";
import AppRoute from "./utils/AppRoute";
import { getFirebaseConfig, initEmulator } from "./utils/firebase";
import ScrollReveal, { ScrollRevealRef } from "./utils/ScrollReveal";
import CheckAuthentication from "./components/elements/CheckAuthentication";
import SignInPage from "./views/Authentication/SignInPage";
import { ConfirmConversationStarters } from "./views/ConfirmConversationStarters";
// Views 
import Home from "./views/Home";
import AccountSettings from "./views/Account/Settings";
import NotFound from "./views/NotFound";
import LayoutAccount from "./layouts/LayoutAccount";
import ApiKeys from "./views/Account/ApiKeys";
import { isEmulator } from "./utils/constants";
import Usage from "./views/Account/Usage";

const firebaseConfig = getFirebaseConfig();


const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );

  const childRef = useRef<ScrollRevealRef>(null);
  let location = useLocation();
  const app = React.useState<FirebaseApp>(initializeApp(firebaseConfig))[0];
  const auth = getAuth(app);
  const fs = getFirestore(app);
  useEffect(() => {
    // const page = location.pathname;
    document.body.classList.add("is-loaded")
    childRef.current!.init();
    // trackPage(page);
  }, [location]);

  useEffect(() => {
    if (isEmulator) initEmulator(app);
  }, [app]);

  return (
    <ThemeProvider theme={theme}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <AuthProvider sdk={auth}>
          <FirestoreProvider sdk={fs}>
            <SnackbarProvider maxSnack={3}>
              <ScrollReveal
                ref={childRef}>
                {() => (
                  <Switch>
                    <AppRoute exact path='/' component={Home} layout={LayoutDefault} />
                    <AppRoute exact path='/signin' component={SignInPage} layout={LayoutDefault} />
                    <CheckAuthentication>
                      <AppRoute exact path='/account/settings'
                        component={AccountSettings}
                        layout={LayoutAccount}
                      />
                      <AppRoute exact path='/account/api-keys'
                        component={ApiKeys}
                        layout={LayoutAccount}
                      />
                      <AppRoute exact path='/account/usage'
                        component={Usage}
                        layout={LayoutAccount}
                      />
                      { /* Redirect /account to /account/settings */}
                      <Redirect exact from="/account" to="/account/settings" />
                      <AppRoute exact path='/confirm' component={ConfirmConversationStarters}
                        layout={LayoutDefault} />
                    </CheckAuthentication>
                    { /* TODO does not work 404 */}
                    <AppRoute exact path="/404" component={NotFound} layout={LayoutDefault} />
                    <Redirect to="/404" />
                  </Switch>
                )}
              </ScrollReveal>
            </SnackbarProvider>
          </FirestoreProvider>
        </AuthProvider>
      </FirebaseAppProvider>
    </ThemeProvider>
  );
}



export default App;
