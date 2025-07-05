import type {
  LLMInterface,
  NPCMessage,
} from "../../dependencies-interfaces/llm.js";
import type { ActionType } from "../../types/action.js";

export class LLMMock implements LLMInterface {
  constructor(
    private generateResponseResponse: NPCMessage | null,
    private detectActioTypeResponse: ActionType | null,
  ) {}
  generateResponse(): Promise<NPCMessage | null> {
    return Promise.resolve(this.generateResponseResponse);
  }
  detectActionType(): Promise<ActionType | null> {
    return Promise.resolve(this.detectActioTypeResponse);
  }
}
