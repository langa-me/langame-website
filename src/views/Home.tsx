import { InstallDesktop, Key, ReadMore } from "@mui/icons-material";
import { Button, Grid, Tooltip } from "@mui/material";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useHistory } from "react-router-dom";
import { Timeline } from "react-twitter-widgets";
import DiscordSamples from "../components/elements/DiscordSamples";
import Hero from "../components/sections/Hero";



const Home = () => {
  const history = useHistory();
  return (
    <>
      <Hero className="illustration-section-01" />

        <Grid container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={4}

        >
          <Grid item
          >
            <Grid item
              sx={{
                textAlign: "center",
                margin: "1em",
              }}
            >
              <Tooltip title="Get conversation starters now and share it with friends">
                  <Button
                    startIcon={<ReadMore/>}
                    variant="outlined"
                    color="secondary"
                    onClick={
                      () => history.push("/signin")
                    }
                  >
                    Get conversation starters now
                  </Button>
                </Tooltip>
            </Grid>
            <Grid item>
            <Grid container
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <Grid item>
                <Tooltip title="Install Langame Discord bot in your community">
                  <Button
                    startIcon={<InstallDesktop/>}
                    variant="outlined"
                    color="primary"
                    onClick={
                      // https://discord.me/langame
                      () => window.open("https://discord.me/langame", "_blank")
                    }
                  >
                    Install the bot
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Join Langame Discord community">
                  <Button
                    startIcon={<Key/>}
                    variant="outlined"
                    color="primary"
                    onClick={
                      // https://discord.me/langame
                      () => window.open("https://discord.gg/7KFwPUr4hj", "_blank")
                    }
                  >
                    Or join the server
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="See what Langame Discord members answered to Langames">
                  <Button
                    startIcon={<ReadMore/>}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      const url = "https://langame.notion.site/3fb80c46b8b046509644cfcd427961b1?v=9bd6caeb4c34406d8806ff58143f388e";
                      // go to url
                      window.open(url, "_blank", "noopener");
                    }}
                  >
                    Member answers
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          </Grid>
          <Grid item
            xs={12}
          >
            <Grid container
              spacing={2}
            >
              <Grid item
                xs={6}
              >
                <DiscordSamples
                  style={{
                    height: "400px",
                  }}
                />
              </Grid>

              <Grid item
                xs={6}
              >
                <Timeline
                  dataSource={{ sourceType: "profile", screenName: "langame_ai" }}
                  options={{
                    theme: "dark",
                    height: "400px",
                    width: "100%",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item
            xs={12}
          >
            <Grid container 
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}>
              <Grid item
                sx={{
                  width: "70%",
                }}
              >
                <a href="https://asciinema.org/a/yJJh2yL8IQz6w1Hhu2VIQHPKG" target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="https://asciinema.org/a/yJJh2yL8IQz6w1Hhu2VIQHPKG.svg" />
                </a>
              </Grid>
              <Grid item>
                <Tooltip title="Integrate Langame real-time conversation starters in your app">
                  <Button
                    startIcon={<ReadMore/>}
                    variant="outlined"
                    color="secondary"
                    onClick={
                      () => history.replace("/account/api-keys")
                    }
                  >
                    Try the API
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

    </>
  );
}



export default Home;
