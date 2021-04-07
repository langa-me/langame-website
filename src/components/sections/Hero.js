import React  from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import Image from '../elements/Image';
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
                AI-Augmented human conversations.
              </p>
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                The Internet and its hyper-connectivity have not solved human conversations.
              </p>
            </div>
          </div>
          <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
            <Image
              className="has-shadow"
              src={require('./../../assets/images/demo.gif')}
              alt="Hero"
              width={896}
              height={504} />
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
