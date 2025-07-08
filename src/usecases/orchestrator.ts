import { isDefined } from "../utils/isDefined.js";
import Logger from "../utils/logger.js";
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
      let action = await npc.act(this.world.resources);

      if (action) {
        const isActionAllowed = this.world.handleAction(action);
        if (isActionAllowed) {
          npc.handleAction(action);
        } else {
          action = await npc.act(this.world.resources);
          if (action) {
            const isActionAllowed = this.world.handleAction(action);
            if (isActionAllowed) {
              npc.handleAction(action);
            }
          }
        }
      }
    }
  }
}
