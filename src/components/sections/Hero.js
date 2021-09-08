import React from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import Image from '../elements/Image';
import 'react-toastify/dist/ReactToastify.css';

const propTypes = {
  ...SectionProps.types,
}

const defaultProps = {
  ...SectionProps.defaults,
}

const random = [
  "Skip the small talk",
  "Have incredibly profound conversations",
  "Share your knowledge",
  "Expand your knowledge",
  "Have the best conversation ever",
  "Learn from each other",
  "Reduce social opacity",
  "Share something new with each other",
  "Be the best version of yourself with each other",
  "Cultivate a deep relationship with someone important to you",
  "Stay curious about life",
  "Learn about your interests and passions",
  "Get to know each other better",
  "Increase your creativity and inspiration",
  "Get to know yourself better",
  "Be present with each other",
  "Be honest about your needs and accept feedback from others",
  "Expand your horizons",
  "Have a profound experience together"
];

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
      <div className='container-sm'>
        <div className={innerClasses}>
          <div className='hero-content'>
            <h1 className='mt-0 mb-16 reveal-from-bottom' data-reveal-delay='200'>
              <span className='text-color-primary'>Langame</span>
            </h1>
            <div className='container-xs'>
              <p className='m-0 mb-32 reveal-from-bottom' data-reveal-delay='400'>
                {random[Math.floor(Math.random() * random.length)]}
              </p>
              <Image
                className='has-shadow'
                src={require('./../../assets/images/openai.png')}
                alt='OpenAI'
                width={100}
                height={100} />
              <p className='m-0 mb-32 reveal-from-bottom' data-reveal-delay='400'>
                Powered by <a target='_blank' rel='noopener noreferrer' href='https://openai.com/'>GPT-3</a>
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
