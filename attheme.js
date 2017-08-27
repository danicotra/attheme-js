"use strict";

class Attheme {
  constructor(theme, fillWithDefault) {
    theme = Attheme._parseText(theme);

    if (fillWithDefault && defaultVariablesValues) {
      for (let variable in defaultValues) {
        this[variable] = defaultValues[variable];
      }
    }

    for (let variable in theme) {
      this[variable] = theme[variable];
    }

    if (theme[Attheme.IMAGE_KEY]) {
      this[Attheme.IMAGE_KEY] = theme[Attheme.IMAGE_KEY];
    }
  }

  asText() {
    const b16 = (n) => n.toString(16).padStart(2, "0"),
          b10 = (n) => parseInt(n);
    let text = "";
    for (let variable in this) {
      const red = b16(this[variable].red),
            green = b16(this[variable].green),
            blue = b16(this[variable].blue),
            alpha = b16(this[variable].alpha),
            hex = `#${(alpha == "ff") ? "" : alpha}${red}${green}${blue}`,
            int = (b10(`${alpha}${red}${green}${blue}`) << 0) + "",

            shortestValue = [hex, int].sort(
              (a, b) => a.length - b.length
            )[0];
      text += `${variable}=${shortestValue}\n`;
    }

    if (this[Attheme.IMAGE_KEY]) {
      text += `WPS\n${this[Attheme.IMAGE_KEY]}\nWPE\n`;
    }

    return text;
  }

  static _parseText(theme = "") {
    if (typeof theme != "string") {
      throw new Error("Attheme.parseText requires a string");
      return;
    }

    const b16 = (n) => n.toString(16).padStart(2, "0"),
          b10 = (n) => parseInt(n);

    const lines = theme.split("\n");
    let themeObject = {};

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (/\/\//.test(line)) {
        line = line.split("//")[0];
      }
      line = line.trim();

      if (line == "WPS") {
        themeObject[Attheme.IMAGE_KEY] = lines.slice(i + 1, -2).join("\n");
        break;
      }

      if (!line || !/=/.test(line)) {
        continue;
      }

      const [variable, value] = line.split("=");
      let color = null;

      if (!value.startsWith("#")) {
        color = b16(parseInt(value) >>> 0).padStart(8, "0");
      } else {
        color = value.slice(1).padStart(8, "f");
      }

      color = {
        red: b10(color.slice(2, 4)),
        green: b10(color.slice(4, 6)),
        blue: b10(color.slice(6, 8)),
        alpha: b10(color.slice(0, 2))
      };
      themeObject[variable] = color;
    }

    return themeObject;
  }

  static get IMAGE_KEY() {
    return Symbol.for("image");
  }
}