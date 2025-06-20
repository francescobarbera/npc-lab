import type { LLMInterface } from "../../dependencies-interfaces/llm.js";
import { NPC } from "../../entities/npc/npc.js";

export class NPCMock extends NPC {
  public initialise = async () => Promise.resolve(null);
  public act = async () => Promise.resolve(null);
  public increaseFirewood = () => {};

  constructor() {
    super({} as LLMInterface, "mock_npc", "mock_goal", [], 0);
  }
}
