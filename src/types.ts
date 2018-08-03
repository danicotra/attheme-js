export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export type Theme = Map<string, Color>;

export type ColorSignature = "hex" | "int";

export interface AtthemeOptions {
  defaultValues?: Theme;
};
