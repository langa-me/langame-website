import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import Modal from '../elements/Modal';
import appStore from './../../assets/images/app-store.svg';
import googlePlay from './../../assets/images/google-play.svg';
import ReactTooltip from 'react-tooltip';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {

  const [videoModalActive, setVideomodalactive] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setVideomodalactive(true);
  }

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
  }   

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              <span className="text-color-primary">Langame</span>
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                Augmented, better human conversations.
                Compound relationships.
                </p>
              {/*<div className="reveal-from-bottom" data-reveal-delay="600">*/}
              {/*  <ButtonGroup>*/}
              {/*    <Button tag="a" color="primary" wideMobile href="https://cruip.com/">*/}
              {/*      Get started*/}
              {/*      </Button>*/}
              {/*    <Button tag="a" color="dark" wideMobile href="https://github.com/cruip/open-react-template/">*/}
              {/*      View on Github*/}
              {/*      </Button>*/}
              {/*  </ButtonGroup>*/}
              {/*</div>*/}
            </div>
          </div>
          <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
            <Image
              className="has-shadow"
              src={require('./../../assets/images/demo.gif')}
              alt="Hero"
              width={896}
              height={504} />
            {/*<a*/}
            {/*  data-video="https://player.vimeo.com/video/174002812"*/}
            {/*  href="#0"*/}
            {/*  aria-controls="video-modal"*/}
            {/*  onClick={openModal}*/}
            {/*>*/}
            {/*  <Image*/}
            {/*    className="has-shadow"*/}
            {/*    src={require('./../../assets/images/video-placeholder.jpg')}*/}
            {/*    alt="Hero"*/}
            {/*    width={896}*/}
            {/*    height={504} />*/}
            {/*</a>*/}
          </div>
          <ReactTooltip id="main"/>

          <div className="distribution">
            <div className="app-store">
              <p data-for="main" data-tip="Coming soon on iOS." data-iscapture="true">
                <img src={appStore} alt="App Store"/>
              </p>
            </div>

            <div className="google-play">
              <p data-for="main" data-tip="Coming soon on Android." data-iscapture="true">
                <img src={googlePlay} alt="Google Play"/>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
