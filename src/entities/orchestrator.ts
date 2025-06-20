import { isDefined } from "../utils/isDefined.js";
import Logger from "../utils/logger.js";
import type { Action, ActionHandler, CollectFirewoodAction } from "./action.js";
import type { NPC } from "./npc/index.js";
import type { World } from "./world/index.js";

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

  public async initialise() {
    this.logger.info("Initialising npcs");

    await Promise.all(this.npcs.map((npc) => npc.initialise()));
  }

  public async nextTurn() {
    this.currentTurn++;

    this.logger.info(`Starting turn ${this.currentTurn}`);

    const npcsActions = await this.collectNpcActions();
    this.processNPCsActions(npcsActions.filter(isDefined));
  }

  private async collectNpcActions() {
    return await Promise.all(
      this.npcs.map((npc) => npc.act(this.world.currentFirewoodKg)),
    );
  }

  private processNPCsActions(actions: Action[]) {
    for (const action of actions) {
      this.world.handleAction(action);

      for (const npc of this.npcs) {
        npc.handleAction(action);
      }
    }
  }
}
