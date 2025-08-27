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

    async function getAllowedAction(npc: NPC, world: World, attempts: number) {
      let remaining = attempts;

      while (remaining-- > 0) {
        const action = await npc.act(world.resources);

        if (!action) {
          return null;
        }
        if (world.handleAction(action)) {
          return action;
        }
      }
      return null;
    }

    for (const npc of this.npcs) {
      const action = await getAllowedAction(npc, this.world, 2);

      if (action) {
        npc.handleAction(action);
      }
    }
  }
}
