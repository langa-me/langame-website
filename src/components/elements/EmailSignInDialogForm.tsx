import { TextField } from "@material-ui/core";
import {
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton
} from "@mui/material";
import { Auth, signInWithEmailAndPassword }
  from "firebase/auth";
import * as React from "react";
import { useAuth } from "reactfire";
import { log } from "../../utils/logs";
import { useSnackbar } from "notistack";
import { Check } from "@mui/icons-material";

interface EmailSignInDialogFormProps {
  onClose: () => void;
  open: boolean;
}
const EmailSignInDialogForm = ({
  onClose, open
}: EmailSignInDialogFormProps) => {
  const auth = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    onClose();
  };

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

  // Show a centered vertically and horizontally form
  // Used for Firebase authentication
  // It should show email and password fields
  // and a sign in button
  return (
    <Dialog onClose={handleClose} open={open}
      sx={{ "& .MuiDialog-paper": { 
        width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
    >
      <DialogTitle

      >
        Enter your email credentials
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4
        }}
      >
        <TextField
          autoFocus
          label="Email" variant="outlined"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField label="Password" variant="outlined"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4
        }}
      >
        <IconButton onClick={() => signIn(auth,
          enqueueSnackbar,
          email, password)}>
          <Check />
        </IconButton>
      </DialogActions>
    </Dialog >
  );
};

export default EmailSignInDialogForm;