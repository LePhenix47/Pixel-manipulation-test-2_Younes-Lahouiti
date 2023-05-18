import { PixelEffect } from "./utils/classes/effects/pixel-effect.class";
import {
  clearOldPaint,
  get2DContext,
} from "./utils/functions/canvas.functions";
import { log } from "./utils/functions/console.functions";
import {
  getAncestor,
  getAttribute,
  getParent,
  selectQuery,
  selectQueryAll,
  setStyleProperty,
} from "./utils/functions/dom.functions";
import {
  formatText,
  kebabToCamelCase,
  splitString,
} from "./utils/functions/string.functions";
import { arrayOfKeyPairs } from "./utils/variables/inputs-map.variables";

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

function showTextToCanvas(event: InputEvent) {
  resetAnimation();

  //We make the changes here

  //

  resetEffect();
  animate();
}

const mouseMapInfos: Map<string, number> = new Map();

const mapInputsInfosForText: Map<string, any> = new Map();

const selectFontHTMLElement: HTMLSelectElement = selectQuery(".index__select");

const inputsArray: HTMLInputElement[] = selectQueryAll(
  ".index__input:not(input#mouse-radius, input#text)"
).concat(selectFontHTMLElement);

const inputText: HTMLInputElement = selectQuery("input#text");

const inputRangeForMouseRadius: HTMLInputElement =
  selectQuery("input#mouse-radius");

const colorInputsArrray: HTMLInputElement[] = selectQueryAll(
  ".index__input--color"
);

log(inputsArray, colorInputsArrray, { inputRangeForMouseRadius });

/**
 * Initializes the color input elements by adding an "input" event listener to each input.
 *
 * @returns {void}
 */
function initializeInputs(): void {
  //We add the event listener to listen to inputs on the text
  inputText.addEventListener("input", setMapValues);

  inputRangeForMouseRadius.addEventListener("input", setMouseRadius);

  //We add the event listenres for the controls for change for performance reasons
  for (const input of inputsArray) {
    input.addEventListener("change", setMapValues);
  }

  //We add event listeners to color swatch inputs to set their color
  for (const colorInput of colorInputsArrray) {
    colorInput.addEventListener("input", setBackgroundToColorInput);
  }
}
initializeInputs();

function setMouseRadius(event) {}

/**
 * Sets the background color of the input element based on its current value.
 * @param {Event} event - The input event triggered by the user.
 *
 * @returns {void}
 */
function setMapValues(event: Event): void {
  resetAnimation();

  //@ts-ignore
  const input: HTMLInputElement = event.currentTarget;

  const formattedNameOfInput: string = kebabToCamelCase(input.name);
  //@ts-ignore
  const inputValue = !isNaN(Number(input.value))
    ? Number(input.value)
    : input.value;

  mapInputsInfosForText.set(formattedNameOfInput, inputValue);

  resetEffect();
  animate();
}

function setBackgroundToColorInput(event: Event): void {
  //@ts-ignore
  const input: HTMLInputElement = event.currentTarget;

  const container: HTMLElement = getAncestor(
    input,
    ".index__color-input-container"
  );

  const labels: HTMLLabelElement[] = selectQueryAll("label", container);

  const showLabel: HTMLLabelElement = labels[0];
  const showCheckbox: HTMLInputElement = selectQuery("input", showLabel);

  const colorLabel: HTMLLabelElement = labels[1];
  const colorLabelType: string = splitString(colorLabel.innerText, ":")[0];

  let formattedInputValue: string = formatText(input.value, "uppercase");

  const spanLabel: HTMLSpanElement = selectQuery(
    ".index__label-span",
    colorLabel
  );

  spanLabel.textContent = formattedInputValue;

  const shouldBeTransparent: boolean = !showCheckbox.checked;

  if (shouldBeTransparent) {
    formattedInputValue = "transparent";
  }

  setStyleProperty("--bg-input-color", formattedInputValue, input);

  switch (colorLabelType) {
    case "Canvas background": {
      setStyleProperty("--bg-input-color", formattedInputValue, input);
      setStyleProperty("--bg-canvas", formattedInputValue, canvas);
      break;
    }

    case "Fill": {
      mapInputsInfosForText.set("fill", formattedInputValue);
      setStyleProperty("--bg-input-color", formattedInputValue, input);
      break;
    }

    case "Stroke color": {
      mapInputsInfosForText.set("strokeColor", formattedInputValue);
      setStyleProperty("--bg-input-color", formattedInputValue, input);
      break;
    }

    default: {
      setStyleProperty("--bg-input-color", formattedInputValue, input);
      break;
    }
  }
}
/**
 * Initializes the {@link mapInputsInfosForText} variable map
 *
 * @returns {void}
 */
function initializeInfosTextMap(): void {
  for (const keyPair of arrayOfKeyPairs) {
    const { key, value } = keyPair;
    mapInputsInfosForText.set(key, value);
  }
}
initializeInfosTextMap();

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

let effect: PixelEffect;
resetEffect();
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

function resetEffect() {
  effect = effect = new PixelEffect(
    canvas,
    mapInputsInfosForText.get("text"),
    mapInputsInfosForText.get("fill"),
    mapInputsInfosForText.get("size"),
    mapInputsInfosForText.get("family"),
    mapInputsInfosForText.get("strokeColor"),
    mapInputsInfosForText.get("strokeWidth"),
    mapInputsInfosForText.get("pixelResolution")
  );
}
