import { InstallDesktop, Key, ReadMore } from "@mui/icons-material";
import { Button, Grid, Tooltip } from "@mui/material";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useHistory } from "react-router-dom";
import { Timeline } from "react-twitter-widgets";
import { ReactComponent as Discord } from "../assets/images/discord.svg";
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
          <Grid item>
            <Discord />
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
            </Grid>
          </Grid>
          
          <Grid item>
            <DiscordSamples />
          </Grid>


          

          <Grid item>
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

          <Grid item>
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

    </>
  );
}



export default Home;
