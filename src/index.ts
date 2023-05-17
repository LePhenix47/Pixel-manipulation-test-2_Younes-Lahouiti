import { PixelEffect } from "./utils/classes/effects/pixel-effect.class";
import {
  clearOldPaint,
  get2DContext,
} from "./utils/functions/canvas.functions";
import { log } from "./utils/functions/console.functions";
import {
  getParent,
  selectQuery,
  selectQueryAll,
  setStyleProperty,
} from "./utils/functions/dom.functions";
import { formatText } from "./utils/functions/string.functions";

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

const colorInputs: HTMLInputElement[] = selectQueryAll(".index__input--color");

/**
 * Initializes the color input elements by adding an "input" event listener to each input.
 *
 * @returns {void}
 */
function initializeInputs(): void {
  for (const input of colorInputs) {
    input.addEventListener("input", setInputBackground);
  }
}
initializeInputs();

/**
 * Sets the background color of the input element based on its current value.
 * @param {Event} event - The input event triggered by the user.
 *
 * @returns {void}
 */
function setInputBackground(event: Event): void {
  const input = event.currentTarget;
  //@ts-ignore
  const label: HTMLLabelElement = getParent(input);

  //@ts-ignore
  const formattedInputValue = formatText(input.value, "uppercase");

  const spanLabel: HTMLSpanElement = selectQuery(".index__label-span", label);
  //@ts-ignore
  spanLabel.textContent = formattedInputValue;
  //@ts-ignore
  setStyleProperty("--bg-input-color", formattedInputValue, input);

  const isCanvasInputColor: boolean =
    label.innerText.includes("Canvas background:");
  if (isCanvasInputColor) {
    //@ts-ignore
    setStyleProperty("--bg-canvas", formattedInputValue, canvas);
    return;
  }
}

const mouseMapInfos: Map<string, number> = new Map();

const inputsInfosForText: Map<string, string | number> = new Map();

inputsInfosForText.set("family", "Arial");
inputsInfosForText.set("fill", "white");
inputsInfosForText.set("font-size", 32);
inputsInfosForText.set("stroke-width", 1);
inputsInfosForText.set("stroke", "transparent");

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

function resetEffect() {
  effect = effect = new PixelEffect(
    canvas,
    //@ts-ignore
    event.target.value,
    "white",
    32,
    "Consolas"
  );
}
