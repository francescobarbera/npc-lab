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

  get isLastTurnOfDay(): boolean {
    return this.currentTurn !== 0 && this.currentTurn % this.turnsPerDay === 0;
  }

  private replenishWorldResources(amount: number) {
    for (const resource of Object.keys(this.world.resources)) {
      this.world.increaseResource(resource as ResourceType, amount);
    }
  }

  private decayNPCResources(amount: number) {
    for (const npc of this.npcs) {
      for (const resource of Object.keys(this.world.resources)) {
        if (npc.resources[resource as ResourceType] > 0) {
          npc.decreaseResource(resource as ResourceType, amount);
        }
      }
    }
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

    if (this.isLastTurnOfDay) {
      this.replenishWorldResources(10);
      this.decayNPCResources(10);
    }
  }
}
