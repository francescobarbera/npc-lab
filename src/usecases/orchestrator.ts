import { isDefined } from "../utils/isDefined.js";
import Logger from "../utils/logger.js";
import type { Action, ActionType } from "../types/action.js";
import type { NPC } from "../entities/npc/npc.js";
import type { World } from "../entities/world/world.js";

export class Orchestrator {
  private logger: Logger;
  private currentTurn = 0;

  constructor(
    private readonly world: World,
    private readonly npcs: NPC[],
  ) {
    this.logger = new Logger("Orchestrator");
  }

  get currentTurnNumber(): number {
    return this.currentTurn;
  }

  public async nextTurn() {
    this.currentTurn++;

    this.logger.info(`Starting turn ${this.currentTurn}`);

    for (const npc of this.npcs) {
      const action = await npc.act(this.world.resources);

      if (action) {
        npc.handleAction(action);
        this.world.handleAction(action);
      }
    }
  }
}
