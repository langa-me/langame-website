import { TextField } from "@material-ui/core";
import { Button, Grid } from "@mui/material";
import { Auth, signInWithEmailAndPassword }
  from "firebase/auth";
import * as React from "react";
import { useAuth } from "reactfire";
import { log } from "../../utils/logs";
import { useSnackbar } from "notistack";
const signIn = async (
  auth: Auth,
  message: (message: string, options?: any) => void,
  email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      message("Signed in", { variant: "success" });
      // Redirect to /confirm
      window.location.href = "/confirm";
    })
    .catch((error) => {
      log(error);
      message(error.message, { variant: "error" });
    });
}
const SignInForm = () => {
  const auth = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  // Show a centered vertically and horizontally form
  // Used for Firebase authentication
  // It should show email and password fields
  // and a sign in button
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{
          minHeight: "100vh",
        }}
      >
        <Grid
          item
          style={{
            backgroundColor: "white",
          }}
          sm={4}
          padding={4}
          border={4}
          alignItems="center"
          justifyContent="center">
          <Grid>
            <TextField label="Email" variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </Grid>
          <Grid item>
            <TextField label="Password" variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Button onClick={() => signIn(auth,
              enqueueSnackbar,
              email, password)}>Sign in</Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SignInForm;