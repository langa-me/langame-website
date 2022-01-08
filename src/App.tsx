import { createTheme, ThemeProvider } from "@mui/material";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useRef } from "react";
import { Switch, useLocation } from "react-router-dom";
import {
  AuthProvider, FirebaseAppProvider, FirestoreProvider,
} from "reactfire";
// Layouts
import LayoutDefault from "./layouts/LayoutDefault";
import AppRoute from "./utils/AppRoute";
import { getFirebaseConfig } from "./utils/firebase";
import ScrollReveal, { ScrollRevealRef } from "./utils/ScrollReveal";
import CheckAuthentication from "./views/Authentication/CheckAuthentication";
import SignInForm from "./views/Authentication/SignInForm";
import { ConfirmConversationStarters } from "./views/ConfirmConversationStarters";
// Views 
import Home from "./views/Home";


const theme = createTheme({
  //   TODO: implement this
});
const firebaseConfig = getFirebaseConfig();


const App = () => {
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
                    <AppRoute exact path='/signin' component={SignInForm} layout={LayoutDefault} />
                    <CheckAuthentication>
                      <AppRoute exact path='/confirm' component={ConfirmConversationStarters} layout={LayoutDefault} />
                    </CheckAuthentication>
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
