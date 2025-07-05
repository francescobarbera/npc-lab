import type {
  LLMInterface,
  NPCMessage,
} from "../../dependencies-interfaces/llm.js";
import type { ActionType } from "../../types/action.js";

export class LLMMock implements LLMInterface {
  generateResponse(): Promise<NPCMessage | null> {
    return Promise.resolve(null);
  }
  detectActionType(): Promise<ActionType | null> {
    return Promise.resolve(null);
  }
}
