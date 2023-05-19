import { clearOldPaint, get2DContext } from "../../functions/canvas.functions";
import { log } from "../../functions/console.functions";
import { splitString } from "../../functions/string.functions";
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
  strokeColor: string;
  /**
   * The stroke width of the text.
   *
   * @type {string}
   */
  strokeWidth: number;

  /**
   * The pixel resolution of the text
   *
   * @type {string}
   */
  pixelResolution: number;

  /**
   * Creates an instance of the PixelEffect class.
   *
   * @param {HTMLCanvasElement} canvas - The HTML canvas element on which the effect is applied.
   * @param {string} text - The text that is used as the source of the pixels for the animation.
   * @param {string} textColor - The color of the text.
   * @param {number} fontSize - The font size of the text.
   * @param {string} fontFamily - The font family of the text.
   * @param {string} [strokeColor="transparent"] - The stroke color of the text.
   * @param {number} [strokeWidth] - The stroke width of the text.
   * @param {number} [pixelResolution] - The pixel resolution of the text.
   */
  constructor(
    canvas: HTMLCanvasElement,
    text: string,
    textColor: string,
    fontSize: number,
    fontFamily: string,
    strokeColor: string = "transparent",
    strokeWidth?: number,
    pixelResolution?: number
  ) {
    this.canvas = canvas;
    this.context = get2DContext(canvas);

    this.particlesArray = [];
    this.text = text;

    const hasNoLetters: boolean = this.text.length === 0;
    log({ hasNoLetters });
    if (hasNoLetters) {
      return;
    }

    this.textColor = textColor;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;

    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;

    this.pixelResolution = pixelResolution;

    this.wrapText();
    // this.drawTextToCanvas();
    this.convertToPixels(this.pixelResolution);
  }

  /**
   * Draws the text on the canvas
   *
   * @returns {void}
   */
  private drawTextToCanvas(): void {
    this.context.fillStyle = this.textColor;
    this.context.strokeStyle = this.strokeColor;

    this.context.font = `${this.fontSize}px ${this.fontFamily}`;

    this.textMetrics = this.context.measureText(this.text);

    this.textX = this.canvas.width / 2 - this.textMetrics.width / 2;
    this.textY = this.canvas.height / 2 + this.fontSize / 2;

    this.context.lineWidth = this.strokeWidth;

    this.context.fillText(this.text, this.textX, this.textY);
    this.context.strokeText(this.text, this.textX, this.textY);

    this.pixelsData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  /**
   * Wraps the text within the canvas horizontally if it overflows.
   *
   * @param {number} maxWidth - The maximum width of the text before wrapping.
   * @returns {void}
   */
  private wrapText(maxWidth: number = this.canvas.width): void {
    //We set the fill and the stroke of the text
    this.context.fillStyle = this.textColor;
    this.context.strokeStyle = this.strokeColor;

    //We set the font
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;

    //We set the text metric
    this.textMetrics = this.context.measureText(this.text);

    //We set the cooridnates of our text
    this.textX = this.canvas.width / 2 - this.textMetrics.width / 2;
    this.textY = this.canvas.height / 2;

    //We set the stroke width/thickness
    this.context.lineWidth = this.strokeWidth;

    //We center the text
    // this.context.textAlign = "center";

    //We split the character on every space
    const words: string[] = splitString(this.text, " ");

    //We're going to use this variables to store the current line of text we're building
    let line: string = "";
    let lineCounter: number = 0;
    const linesArray: string[] = [];

    //We loop through each word
    for (let i = 0; i < words.length; i++) {
      // 1) Building the test line
      /*
      We create a test line by concatenating the current word with the existing line
      Then get its width 
      */
      const testLine: string = line + words[i] + " ";
      const metrics: TextMetrics = this.context.measureText(testLine);
      const testWidth: number = metrics.width;

      // 2) Checking a line overflow

      /*
      We check if the test width > canvas width and that it's not the 1st word
      */
      const overflowsHorizontally: boolean = testWidth > maxWidth;
      const isNotFirstWord: boolean = i > 0;
      if (overflowsHorizontally && isNotFirstWord) {
        /*
        If it does then we render the current line with the methods then
        assign the current word as the start of a new line by setting it to the line variable 

        Finally we update the textY position to the next line by adding it to the fontSize
        */
        this.textX = this.canvas.width / 2 - testWidth / 2;
        this.textY = this.canvas.height / 2 + this.fontSize / 2;

        this.context.fillText(line, this.textX, this.textY);
        this.context.strokeText(line, this.textX, this.textY);

        line = words[i] + " ";
        this.textY += this.fontSize;

        lineCounter++;
      } else {
        /*
        If not then just update the line with 
        the test line since it can accomodate the current word
        */
        line = testLine;
      }
      linesArray[lineCounter] = line;
    }
    // 3) Rendering the remaining line
    /*
    We render the remainig content of the line
    */
    // for (let i = 1; i < linesArray.length; i++) {
    //   const remainingLine: string = linesArray[i];

    //   this.context.fillText(
    //     remainingLine,
    //     this.textX,
    //     this.textY + i * this.fontSize
    //   );
    //   this.context.strokeText(
    //     remainingLine,
    //     this.textX,
    //     this.textY + i * this.fontSize
    //   );
    // }
    this.context.fillText(line, this.textX, this.textY);
    this.context.strokeText(line, this.textX, this.textY);

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
   * Converts the canvas text to pixels with a certain resolution.
   * @private
   * @param {number} [cellSize=1] - The size of the pixel cells.
   *
   * @returns {void}
   */
  private convertToPixels(cellSize: number = 1): void {
    //We remove the static image on our <canvas>
    clearOldPaint(this.context, this.canvas.width, this.canvas.height);

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
