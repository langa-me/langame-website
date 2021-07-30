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
  "Share your knowledge"
]

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
                width={80}
                height={80} />
              <p className='m-0 mb-32 reveal-from-bottom' data-reveal-delay='400'>
                Powered by <a target='_blank' rel='noopener noreferrer' href='https://openai.com/'>OpenAI</a>
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
