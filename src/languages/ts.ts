import * as ts from "typescript";

import JS from "./js";

export default function TS(input: string) {
  const tsInput = ts.transpile(input);
  return JS(tsInput);
}
