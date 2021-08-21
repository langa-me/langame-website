import React from 'react';
import Hero from '../components/sections/Hero';
import GenericSection from "../components/sections/GenericSection";
import FeaturesTiles from "../components/sections/FeaturesTiles";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader


const Home = () => {

  return (
    <>
      <Hero className="illustration-section-01" />

      <GenericSection>

        <div style={{ display:'block', margin: 'auto',  padding: 'auto' }}>
          <a href="https://testflight.apple.com/join/pxxfLXZc" style={{margin: '0px'}}>
            <img
              style={{ display:'block', width: "30%", margin: 'auto' }}
              src={require('../assets/images/app-store.svg')}
              alt="Apple Store" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=me.langa">
            <img
              style={{ display:'block', width: "30%", margin: 'auto' }}
              src={require('../assets/images/google-play.svg')}
              alt="Google Play" />
          </a>
          <a href="https://chrome.google.com/webstore/detail/langame/olfdgbbmfcnogbhflljkgmfjekalkjja?hl=en&authuser=0" style={{margin: '5px'}}>
            <img
              style={{ display:'block', width: "25%", margin: 'auto' }}
              src={require('../assets/images/chrome.svg')}
              alt="Chrome Store" />
          </a>
        </div>



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
