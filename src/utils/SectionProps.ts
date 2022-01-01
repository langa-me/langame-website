// disable "no-redeclare" eslinter rule
/* eslint-disable no-redeclare */
// TODO: until we got rid of prop-types

import PropTypes from "prop-types";

// Props shared by all sections
export type SectionShared = {
  topOuterDivider?: boolean,
  bottomOuterDivider?: boolean,
  topDivider?: boolean,
  bottomDivider?: boolean,
  hasBgColor?: boolean,
  invertColor?: boolean,
}

// Default section props
export type SectionProps = SectionShared;

// Section split props
export type SectionSplitProps = SectionShared & {
  invertMobile?: boolean,
  invertDesktop?: boolean,
  alignTop?: boolean,
  imageFill?: boolean,
}

// Section tiles props
export type SectionTilesProps = SectionShared & {
  pushLeft?: boolean,
}

// Props shared by all sections
const SectionShared = {
  types: {
    topOuterDivider: PropTypes.bool,
    bottomOuterDivider: PropTypes.bool,
    topDivider: PropTypes.bool,
    bottomDivider: PropTypes.bool,
    hasBgColor: PropTypes.bool,
    invertColor: PropTypes.bool
  },
  defaults: {
    topOuterDivider: false,
    bottomOuterDivider: false,
    topDivider: false,
    bottomDivider: false,
    hasBgColor: false,
    invertColor: false
  }
}

// Default section props
export const SectionProps = {
  types: {
    ...SectionShared.types
  },
  defaults: {
    ...SectionShared.defaults
  }
}

// Section split props
export const SectionSplitProps = {
  types: {
    ...SectionShared.types,
    invertMobile: PropTypes.bool,
    invertDesktop: PropTypes.bool,
    alignTop: PropTypes.bool,
    imageFill: PropTypes.bool
  },
  defaults: {
    ...SectionShared.defaults,
    invertMobile: false,
    invertDesktop: false,
    alignTop: false,
    imageFill: false
  }
}

// Section tiles props
export const SectionTilesProps = {
  types: {
    ...SectionShared.types,
    pushLeft: PropTypes.bool
  },
  defaults: {
    ...SectionShared.defaults,
    pushLeft: false
  }
}