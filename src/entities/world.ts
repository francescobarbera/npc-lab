import type { LLMInterface } from "../dependencies-interfaces/llm.js";
import Logger from "../utils/logger.js";
import type { Event } from "./event.js";
import type { NPC } from "./npc.js";

export class World {
  private logger: Logger;
  private currentTurn = 0;

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly npcs: NPC[],
    private totalFirewoodKg: number,
  ) {
    this.logger = new Logger("World");
  }

  async initialise() {
    this.logger.info(`Initialising NPCs ${this.name}`);

    await Promise.all(this.npcs.map((npc) => npc.initialise()));
  }

  async nextTurn() {
    this.currentTurn++;
    this.logger.info(`Starting turn ${this.currentTurn}`);

    for (const npc of this.npcs) {
      const action = await npc.act(this.totalFirewoodKg);

      if (action) {
        this.broadcastEvent({
          iteration: this.currentTurn,
          type: action.type,
          target: [npc, this],
          kg: 10,
        });
      }
    }
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "collect_firewood":
        this.totalFirewoodKg -= event.kg;
        break;
    }
    this.logger.info(`FirewoodsKg ${this.totalFirewoodKg}`);
  }

  broadcastEvent(event: Event) {
    this.handleEvent(event);
    for (const npc of this.npcs) {
      npc.handleEvent(event);
    }
  }
}
