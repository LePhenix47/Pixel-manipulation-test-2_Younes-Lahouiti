import { clearOldPaint, get2DContext } from "../../functions/canvas.functions";
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
   *
   * @type {string}
   */
  text: string;

  /**
   * The metrics of the text used for rendering.
   *
   * @type {TextMetrics}
   */
  textMetrics: TextMetrics;

  /**
   * The x-coordinate of the text position.
   *
   * @type {number}
   */
  textX: number;

  /**
   * The y-coordinate of the text position.
   *
   * @type {number}
   */
  textY: number;

  /**
   * The color of the text.
   *
   * @type {string}
   */
  textColor: string;

  /**
   * The font size of the text.
   *
   * @type {number}
   */
  fontSize: number;

  /**
   * The font family of the text.
   *
   * @type {string}
   */
  fontFamily: string;

  /**
   * The stroke color of the text.
   *
   * @type {string}
   */
  stroke: string;
  /**
   * The stroke width of the text.
   *
   * @type {string}
   */
  strokeWidth: number;

  /**
   * Creates an instance of the PixelEffect class.
   *
   * @param {HTMLCanvasElement} canvas - The HTML canvas element on which the effect is applied.
   * @param {string} text - The text that is used as the source of the pixels for the animation.
   * @param {string} color - The color of the text.
   * @param {number} fontSize - The font size of the text.
   * @param {string} fontFamily - The font family of the text.
   */
  constructor(
    canvas: HTMLCanvasElement,
    text: string,
    textColor: string,
    fontSize: number,
    fontFamily: string,
    stroke?: string,
    strokeWidth?: number
  ) {
    this.canvas = canvas;
    this.context = get2DContext(canvas);

    this.particlesArray = [];
    this.text = text;

    this.textColor = textColor;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;

    this.stroke = stroke;
    this.strokeWidth = strokeWidth;

    this.createText();
    this.convertToPixels(2);
    log(this);
  }

  /**
   * Draws the image on the canvas with a certain pixel resolution
   *
   * @returns {void}
   */
  createText(): void {
    this.context.fillStyle = this.textColor;
    this.context.strokeStyle = this.stroke;
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;

    this.textMetrics = this.context.measureText(this.text);

    this.textX = this.canvas.width / 2 - this.textMetrics.width / 2;
    this.textY = this.canvas.height / 2 - this.fontSize / 2;

    this.context.fillText(this.text, this.textX, this.textY);
    this.context.strokeText(this.text, this.textX, this.textY);
    log(this.context);

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
    clearOldPaint(this.context, this.canvas.width, this.canvas.height);
    log(this.pixelsData);

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
        const pixelColor: string = `rgb(${red}, ${green}, ${blue})`;

        const pixelParticle: PixelParticle = new PixelParticle(
          this.context,
          this.canvas.width,
          this.canvas.height,
          x,
          y,
          pixelColor,
          cellSize,
          0
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
