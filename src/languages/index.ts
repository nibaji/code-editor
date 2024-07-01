import { LanguageOutputProcessors } from "../types/languages";
import JS from "./js";

const outputProcessors: LanguageOutputProcessors = {
  js: JS,
  ts: JS,
};

export default outputProcessors;
