/**
 * An array of key-value pairs representing the default values for the inputs Map
 *
 * @type {{key: string; value: string | number;}[]}
 */
export const arrayOfKeyPairs: (
  | {
      key: string;
      value: string;
    }
  | {
      key: string;
      value: number;
    }
)[] = [
  { key: "text", value: "" },
  { key: "family", value: "Consolas" },
  { key: "fill", value: "white" },
  { key: "size", value: 64 },
  { key: "strokeColor", value: "transparent" },
  { key: "strokeWidth", value: 1 },
  { key: "pixelResolution", value: 3 },
];
