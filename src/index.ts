import { PixelEffect } from "./utils/classes/effects/pixel-effect.class";
import {
  clearOldPaint,
  get2DContext,
} from "./utils/functions/canvas.functions";
import { error, log } from "./utils/functions/console.functions";
import {
  getAncestor,
  getAttribute,
  getChildren,
  getParent,
  selectQuery,
  selectQueryAll,
  setStyleProperty,
} from "./utils/functions/dom.functions";
import { formatSignificantDigitsNumber } from "./utils/functions/internalization.functions";
import { logarithm } from "./utils/functions/number.functions";
import {
  formatText,
  kebabToCamelCase,
  splitString,
} from "./utils/functions/string.functions";
import { arrayOfKeyPairs } from "./utils/variables/inputs-map.variables";

const canvas: HTMLCanvasElement = selectQuery("canvas");
const context: CanvasRenderingContext2D = get2DContext(canvas, {
  willReadFrequently: true,
});

const containerSection: HTMLElement = selectQuery(".index__container");

const mouseMapInfos: Map<string, number> = new Map();

const mapInputsInfosForText: Map<string, any> = new Map();

const selectFontHTMLElement: HTMLSelectElement = selectQuery(".index__select");

const inputsArray: HTMLInputElement[] = selectQueryAll(
  ".index__input:not(input#mouse-radius, input#text)"
).concat(selectFontHTMLElement);

const inputText: HTMLInputElement = selectQuery("input#text");

const inputRangeForMouseRadius: HTMLInputElement =
  selectQuery("input#mouse-radius");

const inputRangeForPixelResolution: HTMLInputElement = selectQuery(
  "input#pixel-resolution"
);

const colorInputsArrray: HTMLInputElement[] = selectQueryAll(
  ".index__input--color"
);

const checkboxInputsArray: HTMLInputElement[] = selectQueryAll(
  ".index__input--checkbox"
);

/**
 * Initializes the color input elements by adding an "input" event listener to each input.
 *
 * @returns {void}
 */
function initializeInputs(): void {
  //We add the event listener to listen to inputs on the text
  inputText.addEventListener("input", setMapValues);

  inputRangeForMouseRadius.addEventListener("input", setMouseRadius);
  inputRangeForPixelResolution.addEventListener(
    "input",
    setInputRangeValueToLabel
  );

  //We add the event listenres for the controls for change for performance reasons
  for (const input of inputsArray) {
    input.addEventListener("change", setMapValues);
  }

  //We add the event listenres for the controls for change for performance reasons
  for (const checkboxInput of checkboxInputsArray) {
    checkboxInput.addEventListener("change", setMapValues);
  }

  //We add event listeners to color swatch inputs to set their color
  for (const colorInput of colorInputsArrray) {
    colorInput.addEventListener("input", setBackgroundToColorInput);
  }
}
initializeInputs();

/**
 * Sets the mouse radius value in the mouseMapInfos map.
 *
 * @param {Event} event - The input event.
 * @returns {void}
 */
function setMouseRadius(event: Event) {
  setInputRangeValueToLabel(event);

  //@ts-ignore
  const inputValue = event.target.value;

  mouseMapInfos.set("radius", inputValue);
}

/**
 * Sets the input range value to the corresponding label element.
 *
 * @param {Event} event - The input event.
 * @returns {void}
 */
function setInputRangeValueToLabel(event: Event) {
  //@ts-ignore
  const input: HTMLInputElement = event.currentTarget;
  let inputValue: number = Number(input.value);

  const formattedInputValue: string = formatSignificantDigitsNumber(inputValue);

  const label: HTMLLabelElement = getParent(input);
  const spanLabel = selectQuery("span", label);

  spanLabel.textContent = formattedInputValue;
}

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

  const container: HTMLElement = getAncestor(
    input,
    ".index__color-input-container"
  );

  const labels: HTMLLabelElement[] = selectQueryAll("label", container);

  let formattedNameOfInput: string = kebabToCamelCase(input.name);

  //@ts-ignore
  let inputValue: string | number = !isNaN(Number(input.value))
    ? Number(input.value)
    : input.value;

  const isNotCheckboxInput: boolean = input.type !== "checkbox";
  log({ isNotCheckboxInput });

  if (isNotCheckboxInput) {
    mapInputsInfosForText.set(formattedNameOfInput, inputValue);

    resetEffect();
    animate();
    return;
  }

  const colorLabel: HTMLLabelElement = labels[1];
  const labelSpan: HTMLSpanElement = selectQuery("span", colorLabel);

  const isNotChecked: boolean = !input.checked;
  log({ isNotChecked });
  if (isNotChecked) {
    inputValue = "transparent";
  } else {
    inputValue = labelSpan.innerText;
  }

  const colorInput: HTMLInputElement = getChildren(colorLabel)[1];
  formattedNameOfInput = kebabToCamelCase(colorInput.name);
  log({ colorInput });
  mapInputsInfosForText.set(formattedNameOfInput, inputValue);

  resetEffect();
  animate();
}

/**
 * Sets the background color of the color input and updates corresponding elements based on the input value.
 *
 * @param {Event} event - The input event.
 * @returns {void}
 */
function setBackgroundToColorInput(event: Event): void {
  //@ts-ignore
  const input: HTMLInputElement = event.currentTarget;

  const container: HTMLElement = getAncestor(
    input,
    ".index__color-input-container"
  );

  const labels: HTMLLabelElement[] = selectQueryAll("label", container);

  const colorLabel: HTMLLabelElement = labels[1];
  const colorLabelType: string = splitString(colorLabel.innerText, ":")[0];

  let formattedInputValue: string = formatText(input.value, "uppercase");

  const spanLabel: HTMLSpanElement = selectQuery(
    ".index__label-span",
    colorLabel
  );

  spanLabel.textContent = formattedInputValue;

  setStyleProperty("--bg-input-color", formattedInputValue, input);

  switch (colorLabelType) {
    case "Canvas background": {
      const showLabel: HTMLLabelElement = labels[0];
      const showCheckbox: HTMLInputElement = selectQuery("input", showLabel);

      const shouldBeTransparent: boolean = !showCheckbox.checked;

      if (shouldBeTransparent) {
        formattedInputValue = "transparent";
      }

      setStyleProperty("--bg-input-color", formattedInputValue, input);
      setStyleProperty("--bg-canvas", formattedInputValue, canvas);
      break;
    }

    case "Fill": {
      setStyleProperty("--bg-input-color", formattedInputValue, input);
      break;
    }

    case "Stroke color": {
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
  resetEffect();
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

/**
 * Resets the animation by canceling it and resetting the effect.
 *
 * @returns {void}
 */
function resetAnimation() {
  cancelAnimation();
  effect.reset();
}

/**
 * Resets the effect by creating a new PixelEffect instance with the provided parameters.
 *
 * @returns {void}
 */
function resetEffect() {
  log(mapInputsInfosForText);
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
