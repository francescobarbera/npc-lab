import Logger from "../utils/logger.js";
import type { Action, ActionHandler, CollectFirewoodAction } from "./action.js";
import type { NPC } from "./npc.js";

class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(action: CollectFirewoodAction, npc: NPC): void {
    npc.increaseFirewood(action.kg);
  }
}
export class World {
  private logger: Logger;
  private currentTurn = 0;
  private readonly actionHandlers: ActionHandler[];

  constructor(
    public readonly name: string,
    private readonly npcs: NPC[],
    private totalFirewoodKg: number,
  ) {
    this.logger = new Logger("World");
    this.actionHandlers = [new CollectFirewoodActionHandler()];
  }

  public async initialise() {
    this.logger.info(`Initialising NPCs ${this.name}`);

    await Promise.all(this.npcs.map((npc) => npc.initialise()));
  }

  public async nextTurn() {
    this.currentTurn++;
    this.logger.info(`Starting turn ${this.currentTurn}`);

    for (const npc of this.npcs) {
      const action = await npc.act(this.totalFirewoodKg);

      // if (action) {
      //   this.broadcastEvent({
      //     iteration: this.currentTurn,
      //     type: action.type,
      //     target: [npc, this],
      //     kg: 10,
      //   });
      // }
    }
  }

  get currentTurnNumber(): number {
    return this.currentTurn;
  }

  handleAction(action: Action) {
    for (const handler of this.actionHandlers) {
      if (handler.supports(action)) {
        handler.handle(action, this);
        return;
      }
    }

    this.logger.info(`No handler found for action type: ${action.type}`);
  }

  // private broadcastEvent(event: Event) {
  //   this.handleAction(event);
  //   for (const npc of this.npcs) {
  //     console.log("event", event);
  //     npc.handleAction(event);
  //   }
  // }

  public decreaseFirewood(kg: number) {
    this.totalFirewoodKg -= kg;
  }
}
