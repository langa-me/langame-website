import { Button, Grid } from "@mui/material";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Timeline } from "react-twitter-widgets";
import { ReactComponent as Discord } from "../assets/images/discord.svg";
import { ReactComponent as Apple } from "../assets/images/app-store.svg";
import { ReactComponent as Google } from "../assets/images/google-play.svg";
import FeaturesTiles from "../components/sections/FeaturesTiles";
import GenericSection from "../components/sections/GenericSection";
import Hero from "../components/sections/Hero";
import { Web } from "@mui/icons-material";
import DiscordSamples from "../components/elements/DiscordSamples";


const Home = () => {
  return (
    <>
      <Hero className="illustration-section-01" />

      <GenericSection>

        <Grid container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Discord />
          </Grid>
          <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={
                  // https://discord.me/langame
                  () => window.open("https://discord.me/langame", "_blank")
                }
              >
                Install now
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={
                  // https://discord.me/langame
                  () => window.open("https://discord.gg/7KFwPUr4hj", "_blank")
                }
              >
                Or join the community
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <DiscordSamples />
          </Grid>

          <Grid item>
            <h1>
              <span>
                Join the platforms
              </span>
            </h1>
          </Grid>

          <Grid container
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Web />}
                onClick={() => {
                  window.location.href = "https://app.langa.me";
                }}
              >
                On Google Chrome
              </Button>
            </Grid>
            <Grid item>
              <a href="https://testflight.apple.com/join/pxxfLXZc" >
                <Apple width={256} height={128} />
              </a>
            </Grid>
            <Grid item>
              <a href="https://play.google.com/store/apps/details?id=me.langa">
                <Google width={256} height={128} />
              </a>
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
      </GenericSection>


      <GenericSection className="illustration-section-02">
        <div className='hero-figure reveal-from-bottom illustration-element-01'
          data-reveal-value='20px' data-reveal-delay='800'>

          <FeaturesTiles />


        </div>
      </GenericSection>

    </>
  );
}



export default Home;
