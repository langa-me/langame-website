import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

type ImagePropTypes = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string,
}

const defaultProps = {
  src: undefined,
  width: undefined,
  height: undefined,
  alt: undefined,
}

const Image = ({
  // eslint-disable-next-line react/prop-types
  className,
  src,
  width,
  height,
  alt,
  ...props
}: ImagePropTypes) => {

  const [loaded, setLoaded] = useState(false);

  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    handlePlaceholder(image.current!);
  }, []);
  
  const placeholderSrc = (w: number, h: number) => {
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"%3E%3C/svg%3E`;
  }

  const handlePlaceholder = (img: HTMLImageElement) => {
    const placeholder = document.createElement("img");
    if (!loaded) {
      img.style.display = "none";
      img.before(placeholder);
      placeholder.src = placeholderSrc(
        Number(img.getAttribute("width") ?? 0),
        Number(img.getAttribute("height") ?? 0)
      );
      placeholder.width = Number(img.getAttribute("width"));
      placeholder.height = Number(img.getAttribute("height"));
      placeholder.style.opacity = "0";
      img.className && placeholder.classList.add(img.className);
      placeholder.remove();
      img.style.display = "";      
    }
  }

  function onLoad() {
    setLoaded(true);
  }  

  return (
    <img
      {...props}
      ref={image}
      className={className}
      src={src}
      width={width}
      height={height}
      alt={alt}
      onLoad={onLoad}/>
  );
}

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;