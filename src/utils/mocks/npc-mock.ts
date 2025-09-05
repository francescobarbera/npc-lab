import type { LLMInterface } from "../../dependencies-interfaces/llm.js";
import type { Action } from "../../types/action.js";
import { NPC } from "../../entities/npc/npc.js";

export class NPCMock extends NPC {
  public act = async (): Promise<Action | null> => Promise.resolve(null);
  public increaseFirewood = () => {};

  constructor() {
    super({} as LLMInterface, "mock_npc", [], {}, {});
  }
}
