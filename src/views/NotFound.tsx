import { Card, CardMedia, Grid, Typography } from "@mui/material";
import React from "react"
import logo from "../assets/images/logo-colourless.png";
const NotFound = () => {
  // Display a big 404 with the logo in background below
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item>
        <Card
          sx={{ maxWidth: "80%",
            backgroundColor: "transparent",
            // remove backgroudImage
            backgroundImage: "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0))",
          }}
        >
          <div style={{ position: "relative" }}>
            <CardMedia
              component="img" image={logo}
              />
            <Typography
              variant="h1"
              sx={{
                // text not selectable
                userSelect: "none",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                // slightly transparent white
                color: "rgba(255,255,255,0.5)",
                fontSize: "13rem",
                fontWeight: "bold",
                textShadow: "0 0 10px black",
              }}
            >
              404
            </Typography>
          </div>
        </Card >
      </Grid>
    </Grid>

  );
}

export default NotFound