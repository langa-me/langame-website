import { createTheme, ThemeProvider } from "@mui/material";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  AuthProvider, FirebaseAppProvider, FirestoreProvider, FunctionsProvider
} from "reactfire";
// Layouts
import LayoutDefault from "./layouts/LayoutDefault";
import { getFirebaseConfig, initEmulator } from "./utils/firebase";
import ScrollReveal, { ScrollRevealRef } from "./utils/ScrollReveal";
import SignInPage from "./views/Authentication/SignInPage";
import { ConfirmConversationStarters } from "./views/ConfirmConversationStarters";
// Views 
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getFunctions } from "firebase/functions";
import { PreferencesProvider } from "./contexts/usePreferences";
import LayoutAccount from "./layouts/LayoutAccount";
import { isEmulator } from "./utils/constants";
import { log } from "./utils/logs";
import ApiKeys from "./views/Account/ApiKeys";
import SavedConversations from "./views/Account/SavedConversations";
import AccountSettings from "./views/Account/Settings";
import Usage from "./views/Account/Usage";
import Collection from "./views/Collection";
import CollectionsList from "./views/CollectionsList";
import Home from "./views/Home";
import NotFound from "./views/NotFound";
import Play from "./views/Play";
import { Users } from "./views/Users";




const firebaseConfig = getFirebaseConfig();


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51KeqduByPr5RRBhXTH0wEo3lQw7tHnV0tLTw25D5cJtJ3TeF1ZXuMSRVdFV0zCbIpxBwVqZXBt3UGZOuFaEyhFqQ00uHwM0Icw");

// hack see src/assets/scss/settings/base/_colors.scss
const theme = createTheme({
  palette: {
    mode: "dark",
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
});
const App = () => {

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
                        <Routes>
                          <Route path='/' element={<LayoutDefault><Home /></LayoutDefault>} />
                          <Route path='/signin' element={<LayoutDefault><SignInPage /></LayoutDefault>} />
                          <Route path="/404" element={<LayoutDefault><NotFound /></LayoutDefault>} />
                          <Route path='/admin/conversation/starter' element={<LayoutAccount><ConfirmConversationStarters /></LayoutAccount>} />
                          <Route path='/admin/users'
                            element={<LayoutAccount><Users /></LayoutAccount>} />
                          <Route path='/account/play'
                            element={<LayoutAccount><Play /></LayoutAccount>}
                          />
                          <Route path='/account/collections/:collection'
                            element={<LayoutAccount><Collection /></LayoutAccount>}
                          />
                          <Route path='/account/collections'
                            element={<LayoutAccount><CollectionsList /></LayoutAccount>}
                          />
                          <Route path='/account/settings'
                            element={<LayoutAccount><AccountSettings /></LayoutAccount>}
                          />
                          <Route path='/account/api-keys'
                            element={<LayoutAccount><ApiKeys /></LayoutAccount>}
                          />
                          <Route path='/account/usage'
                            element={<LayoutAccount><Usage /></LayoutAccount>}
                          />
                          <Route path='/account/conversations'
                            element={<LayoutAccount><SavedConversations /></LayoutAccount>}
                          />
                          <Route
                            path="*"
                            element={<Navigate to="/account/play" replace />}
                          />
                        </Routes>
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
