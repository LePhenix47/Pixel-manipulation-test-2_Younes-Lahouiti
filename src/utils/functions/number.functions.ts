import { error } from "./console.functions";

/**
 * Generates a random number within a specified range.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @param {boolean} includeMin - Whether to include the minimum value in the range.
 * @param {boolean} includeMax - Whether to include the maximum value in the range.
 *
 * @returns {number} A random number within the specified range.
 */
export function getRandomNumber(
  min: number,
  max: number,
  includeMin: boolean = true,
  includeMax: boolean = true
): number {
  const hasInvalidArgument: boolean = min > max || max < min;
  if (hasInvalidArgument) {
    throw new Error(
      `Unexpected error occured in the passed argument values: min > max or max < min`
    );
  }

  const mustIncludeBoth: boolean = includeMin && includeMax;

  const mustIncludeOnlyMin: boolean = includeMin && !includeMax;

  const mustIncludeOnlyMax: boolean = !includeMin && includeMax;

  if (mustIncludeBoth) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else if (mustIncludeOnlyMin) {
    return Math.floor(Math.random() * (max - min)) + min;
  } else if (mustIncludeOnlyMax) {
    return Math.floor(Math.random() * (max - min)) + min + 1;
  } else {
    //We don't include either
    return Math.floor(Math.random() * (max - min - 1)) + min + 1;
  }
}

/**
 * Calculates the nth root of a number.
 *
 * By default acts as a square root `√(x)`
 *
 * @param {number} value - The value for which to calculate the nth root.
 * @param {number} [base=2] - The degree of the root.
 *
 *  @returns {number} The nth root of the value.
 */
export function nthRoot(value: number, base: number = 2): number {
  //We check that the value is negative AND  that the base is pair
  const rootIsInvalid: boolean = value < 0 && base % 2 === 0;
  if (rootIsInvalid) {
    // Negative values cannot have an even root
    //∛(-27) = 3 but √(-16) = undefined
    error("The base passed of the logarithm is invalid");
    return NaN;
  }

  //ⁿ√(x) = x¹/ⁿ
  return value ** (1 / base);
}

/**
 * Calculates the logarithm of a value with a specified base.
 * By default acts as a natural logarithm `logₑ(x)` aka `Ln(x)`
 *
 * @param {number} value - The value for which to calculate the logarithm.
 * @param {number} [base= Math.E] - The base of the logarithm. Default is Euler's number.
 *
 *  @returns {number} The logarithm of the value.
 */
export function logarithm(value: number, base: number = Math.E): number {
  //We check that the base is positive but also different than 1
  //since log(1) = 0 and logₙ(x) = log(x)/log(n), a base of 1 would give a division by 0
  const baseIsInvalid: boolean = base <= 0 || base === 1;
  if (baseIsInvalid) {
    error("The base passed of the logarithm is invalid");
    return NaN;
  }

  //Logarithmic functions cannot have a negative or null value
  const valueIsInvalid: boolean = value <= 0;
  if (valueIsInvalid) {
    error(`The value passed is negative or null!`);
    return NaN;
  }

  return Math.log(value) / Math.log(base);
}

/**
 * Calculates the brightness of a color from its RGB values.
 *
 * @param {number} red - The red component of the color (0-255).
 * @param {number} blue - The blue component of the color (0-255).
 * @param {number} green - The green component of the color (0-255).
 * @param {boolean} hasToBeExact - Specifies whether the exact brightness should be calculated.
 *
 * If `true`, the formula [`(0.2126 × red + 0.7152 × green + 0.0722 × blue)`](https://en.wikipedia.org/wiki/Relative_luminance) is used.
 *
 * If `false`, the average of the RGB values is used.
 *
 *
 * @returns {number} The brightness of the color.
 */
export function getColorBrightness(
  red: number,
  blue: number,
  green: number,
  hasToBeExact: boolean = true
): number {
  if (hasToBeExact) {
    const brightness: number =
      0.2126 * (red % 256) + 0.7152 * (green % 256) + 0.0722 * (blue % 256);

    return brightness;
  }

  return ((red % 256) + (green % 256) + (blue % 256)) / 3;
}
