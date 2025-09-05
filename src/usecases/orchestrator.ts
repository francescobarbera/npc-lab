import Logger from "../utils/logger.js";
import type { NPC } from "../entities/npc/npc.js";
import type { World } from "../entities/world/world.js";
import type { ResourceType } from "../types/resources.js";

export class Orchestrator {
  private logger: Logger;
  private currentTurn = 0;

  constructor(
    private readonly world: World,
    private readonly npcs: NPC[],
    private readonly turnsPerDay: number,
  ) {
    this.logger = new Logger("Orchestrator");
  }

  get currentTurnNumber(): number {
    return this.currentTurn;
  }

  get currentDayNumber(): number {
    return Math.ceil((this.currentTurn + 1) / this.turnsPerDay);
  }

  get isFirstTurnOfDay(): boolean {
    return (
      this.currentTurn !== 0 && (this.currentTurn - 1) % this.turnsPerDay === 0
    );
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

    if (this.isFirstTurnOfDay) {
      for (const resource of Object.keys(this.world.resources)) {
        this.world.increaseResource(resource as ResourceType, 10);
      }
    }
  }
}
