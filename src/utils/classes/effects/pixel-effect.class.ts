import { get2DContext } from "../../functions/canvas.functions";
import { log } from "../../functions/console.functions";
import { PixelParticle } from "../particles/pixel-particle.class";

/**
 * Class that creates the different effects for our image
 *
 * @class
 */
export class PixelEffect {
  /**
   * An array of pixel particles that make up the image drawn on our canvas
   * @private
   * @type {PixelParticle[]}
   */
  private particlesArray: PixelParticle[];

  /**
   * The pixels data of the canvas containing the width, height and data of our scanned image
   *
   *
   * Data is an `Uint8Clamped` array meaning an array of unsigned (>=0) 8-bit short (0-255) clamped integers
   *
   * It contains the color 4 values for each pixel using the `rgba()` model in this manner:
   * `[R,G,B,A,  R,G,B,A,  R,G,B,A...]`
   *
   * @private
   * @type {ImageData}
   */
  private pixelsData: ImageData;

  /**
   * The HTML canvas element on which the effect is applied.
   * @type {HTMLCanvasElement}
   */
  canvas: HTMLCanvasElement;

  /**
   * The 2D context of the HTML canvas element.
   * @type {CanvasRenderingContext2D}
   */
  context: CanvasRenderingContext2D;

  /**
   * The text that is used as the source of the pixels for the animation.
   * @type {HTMLImageElement}
   */
  text: string;
  textMetrics: TextMetrics;
  textX: number;
  textY: number;

  /**
   * Creates an instance of PixelEffect.
   *
   * @param {HTMLCanvasElement} canvas - The HTML canvas element on which the effect is applied.
   * @param {HTMLImageElement} imageElement - The HTML image element that is used as the source of the pixels for the animation.
   *
   * @constructor
   */
  constructor(canvas: HTMLCanvasElement, text: string) {
    this.canvas = canvas;
    this.context = get2DContext(canvas);

    this.particlesArray = [];
    this.text = text;

    this.convertToPixels(2);
  }

  /**
   * Draws the image on the canvas with a certain pixel resolution
   *
   * @returns {void}
   */
  createText(color: string, fontSize: number, fontFamily: number): void {
    this.context.fillStyle = color;
    this.context.font = `${fontSize}px ${fontFamily}`;

    this.textMetrics = this.context.measureText(this.text);

    this.textX = this.canvas.width / 2 - this.textMetrics.width / 2;
    this.textY = this.canvas.height / 2;

    this.context.fillText(this.text, this.textX, this.textY);

    this.pixelsData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  /**
   * Animates the pixels of the canvas.
   *  @returns {void}
   */
  animatePixels(mouseX: number, mouseY: number, mouseRadius = 20_000): void {
    for (const particle of this.particlesArray) {
      particle.update(mouseX, mouseY, mouseRadius);
      particle.draw();
    }
  }

  /**
   * Converts the canvas image to pixels.
   * @private
   * @param {number} [cellSize=1] - The size of the pixel cells.
   *  @returns {void}
   */
  private convertToPixels(cellSize: number = 1): void {
    //We remove the static image on our <canvas>
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < this.pixelsData.height; y += cellSize) {
      for (let x = 0; x < this.pixelsData.width; x += cellSize) {
        const pixelPosX: number = x * 4;
        const pixelPosY: number = y * 4;
        const pixelIndex: number =
          pixelPosX + pixelPosY * this.pixelsData.width;

        const alpha: number = this.pixelsData.data[pixelIndex + 3];

        const isTransparent: boolean = alpha < 10;
        if (isTransparent) {
          continue;
        }
        // Accessing pixel values
        const red: number = this.pixelsData.data[pixelIndex + 0];
        const green: number = this.pixelsData.data[pixelIndex + 1];
        const blue: number = this.pixelsData.data[pixelIndex + 2];

        //We get an approximate value of the brightness of the pixel
        const averageColorBrightness: number = red + green + blue / 3;
        const color: string = `rgb(${red}, ${green}, ${blue})`;

        const pixelParticle: PixelParticle = new PixelParticle(
          this.context,
          this.canvas.width,
          this.canvas.height,
          x,
          y,
          color,
          cellSize
        );

        this.particlesArray.push(pixelParticle);
      }
    }
  }

  /**
   * Reset the prticles array and removes every event listener
   *
   *  @returns {void}
   */
  reset(): void {
    this.particlesArray = [];
  }
}
