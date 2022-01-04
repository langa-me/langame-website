import { createTheme, ThemeProvider } from "@mui/material";
import { initializeAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import { Switch, useLocation } from "react-router-dom";
import { AuthProvider, FirestoreProvider, useFirebaseApp } from "reactfire";
// Layouts
import LayoutDefault from "./layouts/LayoutDefault";
import AppRoute from "./utils/AppRoute";
import ScrollReveal, { ScrollRevealRef } from "./utils/ScrollReveal";
import CheckAuthentication from "./views/Authentication/CheckAuthentication";
import SignInForm from "./views/Authentication/SignInForm";
import { ConfirmConversationStarters } from "./views/ConfirmConversationStarters";
// Views 
import Home from "./views/Home";
import { SnackbarProvider } from "notistack";


const theme = createTheme({
  //   TODO: implement this
});


const App = () => {
  const childRef = useRef<ScrollRevealRef>(null);
  let location = useLocation();
  const app = useFirebaseApp();
  const db = initializeFirestore(app, {});
  const auth = initializeAuth(app);

  useEffect(() => {
    // const page = location.pathname;
    document.body.classList.add("is-loaded")
    childRef.current!.init();
    // trackPage(page);
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={db}>
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
    </ThemeProvider>
  );
}



export default App;
