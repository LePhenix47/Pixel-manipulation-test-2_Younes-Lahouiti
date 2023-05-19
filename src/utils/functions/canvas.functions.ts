/**
 * Gets the 2D rendering context for a given HTML canvas element.
 *
 * @param {HTMLCanvasElement} canvas - The HTML canvas element.
 * @param {CanvasRenderingContext2DSettings} contextAttributes - Canvas context context attributes.
 *
 * @returns {CanvasRenderingContext2D } The 2D rendering context for the canvas.
 */
export function get2DContext(
  canvas: HTMLCanvasElement,
  contextAttributes?: CanvasRenderingContext2DSettings
): CanvasRenderingContext2D {
  return canvas.getContext("2d", contextAttributes);
}

/**
 * Set the width and height of a canvas element.
 *
 * @param {HTMLCanvasElement} canvas - The HTML canvas element.
 * @param {number} width - The new width of the canvas.
 * @param {number} height - The new height of the canvas.
 *
 * @returns {void}
 */
export function setCanvasSize(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): void {
  canvas.width = width;
  canvas.height = height;
}

/**
 * Create a canvas gradient object given a canvas 2D rendering context, starting and ending coordinates,
 *  and an array of colors (any color model accepted).
 *
 * @param {CanvasRenderingContext2D} canvasContext - The canvas 2D rendering context.
 * @param {number} startX - The x-coordinate of the start point for the gradient.
 * @param {number} startY - The y-coordinate of the start point for the gradient.
 * @param {number} endX - The x-coordinate of the end point for the gradient.
 * @param {number} endY - The y-coordinate of the end point for the gradient.
 * @param {string[]} arrayOfColors - An array of colors to use in the gradient.
 *
 * @returns {CanvasGradient} The canvas gradient object.
 */
export function createCanvasGradient(
  canvasContext: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  arrayOfColors: string[]
): CanvasGradient {
  // Create a linear gradient for a canvas
  const canvasGradient: CanvasGradient = canvasContext.createLinearGradient(
    startX,
    startY,
    endX,
    endY
  );

  for (let i = 0; i < arrayOfColors.length; i++) {
    const color: string = arrayOfColors[i];

    canvasGradient.addColorStop(i, color);
  }

  return canvasGradient;
}
/**
 * Creates a line path on a canvas context based on an array of coordinates.
 *
 * @param {CanvasRenderingContext2D} canvasContext - The 2D canvas rendering context.
 * @param {number} startX - The starting x-coordinate of the line path.
 * @param {number} startY - The starting y-coordinate of the line path.
 * @param {{x:number, y:number}[]} arrayOfCoordinates - An array of coordinate objects, each with x and y properties.
 *
 * @returns {void}
 */
export function createLinePath(
  canvasContext: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  arrayOfCoordinates: { x: number; y: number }[]
): void {
  //We start creating a path
  canvasContext.beginPath();

  //we set a starting point
  canvasContext.moveTo(startX, startY);

  for (const coordinates of arrayOfCoordinates) {
    const { x, y } = coordinates;
    canvasContext.lineTo(x, y);
  }

  //We close the path
  canvasContext.closePath();
}

/**
 * Creates a circle on a canvas context.
 *
 * @param {CanvasRenderingContext2D} canvasContext - The 2D canvas rendering context.
 * @param {number} startX - The starting x-coordinate of the circle.
 * @param {number} startY - The starting y-coordinate of the circle.
 * @param {number} radius - The radius of the circle.
 *
 * @returns {void}
 */
export function createCircle(
  canvasContext: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  radius: number
): void {
  canvasContext.arc(startX, startY, radius, 0, Math.PI * 2);
}

/**
 * Rotates the canvas context by a specified angle around a given point.
 *
 * ⚠ Warning: This function must be used between a `save()` and `restore()` method
 *
 * @param {CanvasRenderingContext2D} canvasContext - The 2D canvas rendering context.
 * @param {number} startX - The x-coordinate of the point around which to rotate.
 * @param {number} startY - The y-coordinate of the point around which to rotate.
 * @param {number} rotation - The angle of rotation in radians.
 *
 * @returns {void}
 */
export function rotateCanvas(
  canvasContext: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  rotation: number
): void {
  canvasContext.translate(startX, startY);
  canvasContext.rotate(rotation);
}

/**
 * Clears the previous paint on the canvas by calling `clearRect()` on the given context.
 *
 * @param {CanvasRenderingContext2D} canvasContext - The 2D rendering context of the canvas.
 * @param {number} canvasWidth - The width of the canvas in pixels.
 * @param {number} canvasHeight - The height of the canvas in pixels.
 *
 * @returns {void}
 */
export function clearOldPaint(
  canvasContext: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
 * Redraws the canvas with a semi-transparent black fill
 *
 * @param {CanvasRenderingContext2D} canvasContext - The 2D context of the canvas to redraw
 * @param {number} canvasWidth - The width of the canvas to redraw
 * @param {number} canvasHeight - The height of the canvas to redraw
 *
 *  @returns {void}
 */
export function redrawOnOldPaint(
  canvasContext: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  canvasContext.fillStyle = "rgba(0, 0, 0, 10%)";
  canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
}
