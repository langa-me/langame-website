import React from "react";
import classNames from "classnames";
import { SectionProps } from "../../utils/SectionProps";
import { getRandom } from "../../utils/random";

type HeroProps = SectionProps & React.HTMLProps<HTMLDivElement>

const propTypes = {
  ...SectionProps.types,
}

const defaultProps = {
  ...SectionProps.defaults,
}

const random = [
  // "Skip the small talk",
  // "Have incredibly profound conversations",
  // "Share your knowledge",
  // "Learn from each other",
  // "Share something new with each other",
  // "Discover new aspects of yourself",
  // "Discover new aspects of your friends",
  // "Be the best version of yourself with each other",
  // "Cultivate a deep relationship with someone important to you",
  // "Stay curious about life",
  // "Cultivate your curiosity",
  // "Learn about your interests and passions",
  // "Get to know each other better",
  // "Increase your creativity and inspiration",
  // "Get to know yourself better",
  // "Be present with each other",
  // "Be honest about your needs and accept feedback from others",
  // "Expand your horizons",
  // "Have a profound experience together",
  // "Make new friends",
  // "Strengthen your relationships",
  // "Grow your relationships",
  // "Be more open and honest",
  // "Open yourself to your friends and family",
  // "Perzonalied conversation starters generated by AI",
  // "Big talks generated by AI",
  // "Deep conversations thanks to AI",
  // "Get to know each other faster thanks to AI generated conversation starters",
  "New mediums of human conversation",
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
}: HeroProps) => {
  const text = React.useState(random[Math.floor(getRandom() * random.length)])[0];

  const outerClasses = classNames(
    "hero section center-content",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "hero-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  return (
    // @ts-ignore
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
                {text}
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
