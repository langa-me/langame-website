import React from 'react';
import Hero from '../components/sections/Hero';
import GenericSection from "../components/sections/GenericSection";
import FeaturesTiles from "../components/sections/FeaturesTiles";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Timeline } from "react-twitter-widgets";
import { Button, Grid } from '@material-ui/core';
import { ReactComponent as Google } from '../assets/images/google-play.svg';
import { ReactComponent as Apple } from '../assets/images/app-store.svg';
const Home = () => {

  return (
    <>
      <Hero className="illustration-section-01" />

      <GenericSection>

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
          <Grid item xs={3} style={{ flexBasis: "0%" }}>
            <Button
              color="primary" variant="outlined">
              <a href="https://app.langa.me" style={{ margin: '0px' }}>
                Try now
              </a>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <a href="https://testflight.apple.com/join/pxxfLXZc" style={{ margin: '0px' }}>
              <Apple width={256} height={128} />
            </a>
          </Grid>
          <Grid item xs={3}>
            <a href="https://play.google.com/store/apps/details?id=me.langa">
              <Google width={256} height={128} />
            </a>
          </Grid>
        </Grid>

      </GenericSection>


      <GenericSection className="illustration-section-02" children={
        <div className='hero-figure reveal-from-bottom illustration-element-01' data-reveal-value='20px' data-reveal-delay='800'>
          {/* <p className='m-0 mb-32 reveal-from-bottom' data-reveal-delay='400'>
            Join the closed beta now for early access to the conversations of the future.
          </p> */}

          {/* <CustomForm /> */}

          {/*<ImageHorizontalList/>*/}

          <FeaturesTiles />

          {/*<Image*/}
          {/*  className='has-shadow'*/}
          {/*  src={require('./../assets/images/demo.gif')}*/}
          {/*  alt='Hero'*/}
          {/*  width={896}*/}
          {/*  height={504} />*/}


        </div>
      } />

    </>
  );
}



export default Home;
