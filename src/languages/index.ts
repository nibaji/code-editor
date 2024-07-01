import JS from "./js";
import TS from "./ts";

import type { LanguageOutputProcessors } from "../types/languages";

const outputProcessors: LanguageOutputProcessors = {
  js: JS,
  ts: TS,
};

export default outputProcessors;
