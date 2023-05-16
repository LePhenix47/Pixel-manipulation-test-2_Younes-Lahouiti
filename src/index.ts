import { PixelEffect } from "./utils/classes/effects/pixel-effect.class";
import {
  clearOldPaint,
  get2DContext,
} from "./utils/functions/canvas.functions";
import { log } from "./utils/functions/console.functions";
import { selectQuery } from "./utils/functions/dom.functions";

log("Hello world!");

const canvas: HTMLCanvasElement = selectQuery("canvas");
const context: CanvasRenderingContext2D = get2DContext(canvas, {
  willReadFrequently: true,
});

const containerSection: HTMLElement = selectQuery(".index__container");

const textInput: HTMLInputElement = selectQuery(".index__input");

const mouseMapInfos: Map<string, number> = new Map();
mouseMapInfos.set("x", 0);
mouseMapInfos.set("y", 0);
mouseMapInfos.set("radius", 200);

let animationId: number = 0;

//We set the width and height of the raster of the canvas
canvas.width = containerSection.clientWidth;
canvas.height = containerSection.clientHeight;

// Handles the containerSection clientWidth event by adjusting the canvas raster accordingly.
function handleWindowResize(): void {
  canvas.width = containerSection.clientWidth;
  canvas.height = containerSection.clientHeight;
}
handleWindowResize();
//We resize the canvas whenever the user resizes the window of the browser
window.addEventListener("resize", handleWindowResize);

canvas.addEventListener("mousemove", setMouseCoords);
function setMouseCoords(event: MouseEvent) {
  mouseMapInfos.set("x", event.x);
  mouseMapInfos.set("y", event.y);
}

let effect = new PixelEffect(canvas, textInput.value);
function animate() {
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

//Cancels the animation loop
function cancelAnimation() {
  cancelAnimationFrame(animationId);
}
