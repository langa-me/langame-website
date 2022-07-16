import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useRef } from "react";
import { Redirect, Switch, useLocation } from "react-router-dom";
import {
  AuthProvider, FirebaseAppProvider, FirestoreProvider, FunctionsProvider,
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
import { Users } from "./views/Users";
import { ConversationAssistance } from "./views/ConversationAssistance";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import Billing from "./views/Account/Billing";
import { getFunctions } from "firebase/functions";
import { log } from "./utils/logs";
import SavedConversations from "./views/Account/SavedConversations";
import Play from "./views/Play";
import { PreferencesProvider } from "./contexts/usePreferences";
import CollectionsList from "./views/CollectionsList";
import Collection from "./views/Collection";

const firebaseConfig = getFirebaseConfig();


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51KeqduByPr5RRBhXTH0wEo3lQw7tHnV0tLTw25D5cJtJ3TeF1ZXuMSRVdFV0zCbIpxBwVqZXBt3UGZOuFaEyhFqQ00uHwM0Icw");


const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // hack see src/assets/scss/settings/base/_colors.scss
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            light: "#6163FF",
            main: "#ACADFF",
            dark: "#5658DD",
            contrastText: "#E9E9FF"
          },
          secondary: {
            light: "#24E5AF",
            main: "#73EFCC",
            dark: "#1CB68B",
            contrastText: "#D2F9EE"
          },
          error: {
            main: "#FF6171"
          },
          warning: {
            main: "#FFA173"
          },
          info: {
            main: "#24E5AF"
          },
        },
      }),
    [prefersDarkMode],
  );

  const childRef = useRef<ScrollRevealRef>(null);
  let location = useLocation();
  const app = React.useState<FirebaseApp>(initializeApp(firebaseConfig))[0];
  const auth = getAuth(app);
  const fs = getFirestore(app);
  const functions = getFunctions();
  useEffect(() => {
    // const page = location.pathname;
    document.body.classList.add("is-loaded")
    childRef.current!.init();
    // trackPage(page);
  }, [location]);

  useEffect(() => {
    if (isEmulator) {
      try {
        initEmulator(app);
      } catch {
        log("Emulator not found");
      }
    }
  }, [app]);

  return (
    <ThemeProvider theme={theme}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <AuthProvider sdk={auth}>
          <FirestoreProvider sdk={fs}>
            <FunctionsProvider sdk={functions}>
              <PreferencesProvider>
                <SnackbarProvider maxSnack={3}>
                  <Elements stripe={stripePromise}>
                    <ScrollReveal
                      ref={childRef}>
                      {() => (
                        <Switch>
                          <AppRoute exact path='/' component={Home} layout={LayoutDefault} />
                          <AppRoute exact path='/signin' component={SignInPage} layout={LayoutDefault} />
                          <AppRoute exact path="/404" component={NotFound} layout={LayoutDefault} />
                          <CheckAuthentication>
                            <AppRoute exact path='/admin/conversation/starter' component={ConfirmConversationStarters}
                              layout={LayoutAccount} />
                            <AppRoute exact path='/admin/conversation/assistance' component={ConversationAssistance}
                              layout={LayoutAccount} />
                            <AppRoute exact path='/admin/users' component={Users}
                              layout={LayoutAccount} />
                            <AppRoute exact path='/account/play'
                              component={Play}
                              layout={LayoutAccount}
                            />
                            <AppRoute exact path='/account/collections/:collection'
                              component={Collection}
                              layout={LayoutAccount}
                            />
                            <AppRoute exact path='/account/collections'
                              component={CollectionsList}
                              layout={LayoutAccount}
                            />
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
                            <AppRoute exact path='/account/conversations'
                              component={SavedConversations}
                              layout={LayoutAccount}
                            />
                            <AppRoute exact path='/account/billing'
                              component={Billing}
                              layout={LayoutAccount}
                            />
                            { /* Redirect /account to /account/play */}
                            <Redirect exact from="/account/*" to="/account/play" />
                          </CheckAuthentication>
                        </Switch>
                      )}
                    </ScrollReveal>
                  </Elements>
                </SnackbarProvider>
              </PreferencesProvider>
            </FunctionsProvider>
          </FirestoreProvider>
        </AuthProvider>
      </FirebaseAppProvider>
    </ThemeProvider>
  );
}



export default App;
