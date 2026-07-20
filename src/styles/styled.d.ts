import "styled-components";
import type { AppTheme } from "./theme";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging, not a redundant interface
  export interface DefaultTheme extends AppTheme {}
}
