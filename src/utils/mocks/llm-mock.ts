import type { LLMInterface } from "../../dependencies-interfaces/llm.js";
import type { Action } from "../../types/action.js";

export class LLMMock implements LLMInterface {
  generateResponse(): Promise<Action | null> {
    return Promise.resolve(null);
  }
}
