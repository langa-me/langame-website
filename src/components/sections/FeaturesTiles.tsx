import React from "react";
import classNames from "classnames";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import { ReactComponent as FTITwo } from "../../assets/images/feature-tile-icon-02.svg";
import { ReactComponent as FTIFour } from "../../assets/images/feature-tile-icon-04.svg";
import { ReactComponent as FTISix } from "../../assets/images/feature-tile-icon-06.svg";

type FeatureTilesProps = SectionTilesProps & React.HTMLProps<HTMLDivElement>

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}
const FeaturesTiles = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}: FeatureTilesProps) => {

  const outerClasses = classNames(
    "features-tiles section",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "features-tiles-inner section-inner pt-0",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const tilesClasses = classNames(
    "tiles-wrap center-content",
    pushLeft && "push-left"
  );

  const sectionHeader = {
    title: "Langame",
    paragraph: "Augmented conversations"
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
             <div className="tiles-item-inner">
               <div className="features-tiles-item-header">
                 <div className="features-tiles-item-image mb-16">
                    <FTITwo />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Strengthen your relationships
                  </h4>
                  <p className="m-0 text-sm">
                    Improve your relationships with your friends through frequent, meaningful interactions.
                  </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <FTIFour />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Learn
                  </h4>
                  <p className="m-0 text-sm">
                    With Langame, you can have conversations about any topic.
                    Conversations are a great way to learn new things
                  </p>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="400">
              <div className="tiles-item-inner">
                <div className="features-tiles-item-header">
                  <div className="features-tiles-item-image mb-16">
                    <FTISix />
                  </div>
                </div>
                <div className="features-tiles-item-content">
                  <h4 className="mt-0 mb-8">
                    Get to know your friends better
                  </h4>
                  <p className="m-0 text-sm">
                    Become more transparent in your interactions with others and get to know yourself better.
                    Build stronger relationships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

FeaturesTiles.propTypes = propTypes;
FeaturesTiles.defaultProps = defaultProps;

export default FeaturesTiles;
