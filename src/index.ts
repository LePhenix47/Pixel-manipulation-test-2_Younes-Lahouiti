import { PixelEffect } from "./utils/classes/effects/pixel-effect.class";
import {
  clearOldPaint,
  get2DContext,
} from "./utils/functions/canvas.functions";
import { log } from "./utils/functions/console.functions";
import { selectQuery } from "./utils/functions/dom.functions";

/**
 * Logs a message to the console.
 *
 * @param {string} message - The message to log.
 */
log("Hello world!");

const canvas: HTMLCanvasElement = selectQuery("canvas");
const context: CanvasRenderingContext2D = get2DContext(canvas, {
  willReadFrequently: true,
});

const containerSection: HTMLElement = selectQuery(".index__container");

const textInput: HTMLInputElement = selectQuery(".index__input");
textInput.addEventListener("input", showTextToCanvas);

const mouseMapInfos: Map<string, number> = new Map();

let animationId: number = 0;

// We set the width and height of the raster of the canvas
canvas.width = containerSection.clientWidth;
canvas.height = containerSection.clientHeight;

/**
 * Handles the window resize event by adjusting the canvas raster accordingly.
 *
 * @returns {void} - Nothing
 */
function handleWindowResize(): void {
  canvas.width = containerSection.clientWidth;
  canvas.height = containerSection.clientHeight;
}
handleWindowResize();

// We resize the canvas whenever the user resizes the window of the browser
window.addEventListener("resize", handleWindowResize);

/**
 * Sets the mouse coordinates in the `mouseMapInfos` map.
 *
 * @param {MouseEvent} event - The mouse event object.
 *
 * @returns {void} - Nothing
 */
function setMouseCoords(event: MouseEvent): void {
  mouseMapInfos.set("x", event.x);
  mouseMapInfos.set("y", event.y);
}
canvas.addEventListener("mousemove", setMouseCoords);

let effect = new PixelEffect(canvas, textInput.value, "white", 32, "Consolas");
// effect.createText("white", 32, "Consolas");
/**
 * Animates the canvas by continuously rendering the pixel effect.
 *
 * @returns {void} - Nothing
 */
function animate(): void {
  clearOldPaint(context, canvas.width, canvas.height);
  // Call functions or methods to create effects in the canvas here
  effect.animatePixels(
    mouseMapInfos.get("x"),
    mouseMapInfos.get("y"),
    mouseMapInfos.get("radius")
  );

  // Create a loop
  animationId = requestAnimationFrame(animate);
}
animate();

/**
 * Cancels the animation loop.
 *
 * @returns {void} - Nothing
 */
function cancelAnimation(): void {
  cancelAnimationFrame(animationId);
  clearOldPaint(context, canvas.width, canvas.height);
}

function resetAnimation() {
  cancelAnimation();
  effect.reset();
}

function showTextToCanvas(event: InputEvent) {
  resetAnimation();
  effect = effect = new PixelEffect(
    canvas,
    //@ts-ignore
    event.target.value,
    "white",
    32,
    "Consolas"
  );
  //@ts-ignore
  log(event.target.value);
  animate();
}
