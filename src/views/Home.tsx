import { Grid } from "@mui/material";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Timeline } from "react-twitter-widgets";
import { ReactComponent as Apple } from "../assets/images/app-store.svg";
import { ReactComponent as Discord } from "../assets/images/discord.svg";
import { ReactComponent as Google } from "../assets/images/google-play.svg";
import { ReactComponent as Browser } from "../assets/images/browser.svg";
import FeaturesTiles from "../components/sections/FeaturesTiles";
import GenericSection from "../components/sections/GenericSection";
import Hero from "../components/sections/Hero";
const Home = () => {
  return (
    <>
      <Hero className="illustration-section-01" />

      <GenericSection>

        <Grid container
          direction='row'
          alignItems="center"
          justifyContent="center"
          spacing={4}
          xs={12}
        >
          <Timeline
            dataSource={{ sourceType: "profile", screenName: "langame_ai" }}
            options={{
              theme: "dark",
              height: "400px",
            }}
          />
          <Grid container direction='row'
            alignItems="center"
            justifyContent="center"
            spacing={0}
          >
            {/* TODO: flexBasis hack */}
            <Grid item xs={3}>
              <a href="https://app.langa.me" style={{ margin: "0px" }}>
                <Browser width={256} height={128} />
              </a>
            </Grid>
            <Grid item xs={3}>
              <a href="https://discord.gg/7KFwPUr4hj" style={{ margin: "0px" }}>
                <Discord width={256} height={128} />
              </a>
            </Grid>
            <Grid item xs={3}>
              <a href="https://testflight.apple.com/join/pxxfLXZc" style={{ margin: "0px" }}>
                <Apple width={256} height={128} />
              </a>
            </Grid>
            <Grid item xs={3}>
              <a href="https://play.google.com/store/apps/details?id=me.langa">
                <Google width={256} height={128} />
              </a>
            </Grid>
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
