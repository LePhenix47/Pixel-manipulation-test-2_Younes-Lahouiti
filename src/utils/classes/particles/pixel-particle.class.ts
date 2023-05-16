import { log } from "../../functions/console.functions";
import { getRandomNumber } from "../../functions/number.functions";

/**
 * A class that represents a single pixel in the PixelEffect animation.
 *
 * @class
 */
export class PixelParticle {
  /**
   * The canvas rendering context used to draw the particle.
   */
  context: CanvasRenderingContext2D;
  /**
   * The width of the canvas.
   */
  width: number;
  /**
   * The height of the canvas.
   */
  height: number;
  /**
   * The x-coordinate of the pixel in the original image.
   */
  originX: number;
  /**
   * The y-coordinate of the pixel in the original image.
   */
  originY: number;
  /**
   * The color of the pixel.
   */
  color: string;
  /**
   * The current x-coordinate of the particle.
   */
  x: number;
  /**
   * The current y-coordinate of the particle.
   */
  y: number;
  /**
   * The distance between the particle and its nearest neighbor.
   */
  gap: number;
  /**
   * The size of the particle.
   */
  size: number;
  /**
   * The current velocity of the particle along the x-axis.
   */
  vectorX: number;
  /**
   * The current velocity of the particle along the y-axis.
   */
  vectorY: number;
  /**
   * The distance between the particle and the mouse along the x-axis.
   */
  mouseParticleDistanceX: number;
  /**
   * The distance between the particle and the mouse along the y-axis.
   */
  mouseParticleDistanceY: number;
  /**
   * The total distance between the particle and the mouse.
   */
  mouseTotalDistance: number;
  /**
   * The force applied to the particle when it is near the mouse.
   */
  force: number;
  /**
   * The angle between the particle and the mouse.
   */
  angle: number;
  /**
   * The friction applied to the particle's velocity.
   */
  friction: number;
  /**
   * The ease applied to the particle's movement.
   */
  ease: number;

  /**
   * @param {CanvasRenderingContext2D} context - The canvas rendering context used to draw the particle.
   * @param {number} width - The width of the canvas.
   * @param {number} height - The height of the canvas.
   * @param {number} pixelX - The x-coordinate of the pixel in the original image.
   * @param {number} pixelY - The y-coordinate of the pixel in the original image.
   * @param {string} pixelColor - The color of the pixel.
   * @param {number} pixelSize - The size of the pixel.
   * @param {number} [pixelGap=0] - The distance between the pixel and its nearest neighbor.
   *
   * @constructor
   */
  constructor(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    pixelX: number,
    pixelY: number,
    pixelColor: string,
    pixelSize: number,
    pixelGap: number = 0
  ) {
    this.context = context;
    this.width = width;
    this.height = height;

    this.originX = pixelX;
    this.originY = pixelY;
    this.color = pixelColor;

    const canvasOverflowsWindow: boolean =
      this.width > window.innerWidth || this.height > window.innerHeight;
    if (canvasOverflowsWindow) {
      this.x = this.originX;
      this.y = this.originY;
    } else {
      this.x = getRandomNumber(0, this.width);
      this.y = getRandomNumber(0, this.height);
    }

    this.gap = pixelGap;

    this.size = pixelSize - this.gap;

    this.vectorX = 0;
    this.vectorY = 0;

    this.mouseParticleDistanceX = 0;
    this.mouseParticleDistanceY = 0;
    this.mouseTotalDistance = 0;

    this.force = 0;
    this.angle = 0;

    this.friction = Math.random() * 0.6 + 0.15;
    this.ease = Math.random() * 0.2 + 0.05;
  }

  /**
   * Updates the pixel particle to go around the mouse
   *
   * @param {number} mouseX - The mouseX of the canvas.
   * @param {number} mouseY - The mouseY of the canvas.
   *
   * @returns {void}
   */
  update(mouseX: number, mouseY: number, mouseRadius = 20_000): void {
    //We get the top left coordinates of our canvas
    const { x, y }: DOMRect = this.context.canvas.getBoundingClientRect();

    this.mouseParticleDistanceX = mouseX - this.x - x;
    this.mouseParticleDistanceY = mouseY - this.y - y;

    //We're not going to compute the hypothenuse with `Math.sqrt()` for performance reasons
    this.mouseTotalDistance =
      this.mouseParticleDistanceX ** 2 + this.mouseParticleDistanceY ** 2;

    //Because we're not properly computing the hypotenuse,
    //the mouse radius value must be high
    const isCloseToMouse: boolean = this.mouseTotalDistance < mouseRadius;
    if (isCloseToMouse) {
      /*
                  /|
                 / |
                /  |
               /   |
              /    |
             /     |
            /______|
       */
      //We have the dx and dy but NOT the hypothenuse of the triangle traced from the mouse to the particle
      //And we want to get angle of the circle on the adjacent-hypothenuse side
      this.angle = Math.atan2(
        this.mouseParticleDistanceY,
        this.mouseParticleDistanceX
      );

      this.force = (-1 * mouseRadius) / this.mouseTotalDistance;

      this.vectorX = Math.cos(this.angle) * this.force;
      this.vectorY = Math.sin(this.angle) * this.force;
    }

    this.vectorX *= this.friction;
    this.vectorY *= this.friction;

    this.x += this.vectorX + (this.originX - this.x) * this.ease;
    this.y += this.vectorY + (this.originY - this.y) * this.ease;
  }

  /**
   * Draws the pixel particle in the `<canvas>`
   *
   * @returns {void}
   */
  draw(): void {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.size, this.size);
  }
}
