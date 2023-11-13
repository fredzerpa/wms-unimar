/**
  The linearGradient() function helps you to create a linear gradient color background
 */

const linearGradient = (color, colorState, angle = 195) => {
  return `linear-gradient(${angle}deg, ${color}, ${colorState})`;
}

export default linearGradient;
