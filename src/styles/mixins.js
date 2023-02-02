import { Dimensions, PixelRatio } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const guideLineBaseWidth = 375;

/**
 *
 * @param {number} size
 */
export function scaleSize(size) {
  return (WINDOW_WIDTH / guideLineBaseWidth) * size;
}

/**
 *
 * @param {number} size
 */
export function scaleFont(size) {
  return size * PixelRatio.getFontScale();
}

function dimensions(top, right = top, bottom = top, left = right, property) {
  const styles = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(top, right, bottom, left) {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(top, right, bottom, left) {
  return dimensions(top, right, bottom, left, 'padding');
}

// export function boxShadow(
//   color,
//   offset = { height: 2, width: 2 },
//   radius: 8,
//   opacity: 0.2,
// ) {
//   return {
//     shadowColor: color,
//     shadowOffset: offset,
//     shadowOpacity: opacity,
//     shadowRadius: radius,
//     elevation: radius,
//   };
// }
