import "styled-components";
import { theme } from "./theme";

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

type ThemeType = typeof theme;

declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeType {}
}
