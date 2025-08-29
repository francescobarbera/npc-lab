import Logger from "../utils/logger.js";
import type { NPC } from "../entities/npc/npc.js";
import type { World } from "../entities/world/world.js";
import type { Action } from "../types/action.js";

export class Orchestrator {
  private logger: Logger;
  private currentTurn = 0;

  constructor(
    private readonly world: World,
    private readonly npcs: NPC[],
    private readonly turnsPerDay = 5,
  ) {
    this.logger = new Logger("Orchestrator");
  }

  get currentTurnNumber(): number {
    return this.currentTurn;
  }

  get currentDayNumber(): number {
    return Math.ceil((this.currentTurn + 1) / this.turnsPerDay);
  }

  public async nextTurn() {
    this.currentTurn++;

    this.logger.info(`Starting turn ${this.currentTurn}`);

    async function getAllowedAction(
      npc: NPC,
      world: World,
      attempts: number,
    ): Promise<Action> {
      let remaining = attempts;
      const defaultAction = {
        type: "rest",
        reason: "default action",
        actor: npc,
      };

      while (remaining-- > 0) {
        const action = await npc.act(world.resources);

        if (!action) {
          return defaultAction;
        }
        if (world.handleAction(action)) {
          return action;
        }
      }
      return defaultAction;
    }

    for (const npc of this.npcs) {
      const action = await npc.act(this.world.resources);

      if (action) {
        npc.handleAction(action);
        this.world.handleAction(action);
      }
    }
  }
}
