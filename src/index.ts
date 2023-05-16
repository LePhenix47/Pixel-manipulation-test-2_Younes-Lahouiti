import { get2DContext } from "./utils/functions/canvas.functions";
import { log } from "./utils/functions/console.functions";
import { selectQuery } from "./utils/functions/dom.functions";

log("Hello world!");

const canvas: HTMLCanvasElement = selectQuery("canvas");
const context: CanvasRenderingContext2D = get2DContext(canvas);

const containerSection: HTMLElement = selectQuery(".index__container");
