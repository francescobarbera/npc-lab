import type {
  LLMInterface,
  Message,
} from "../../dependencies-interfaces/llm.js";
import type {
  Action,
  ActionHandler,
  CollectFirewoodAction,
} from "../action.js";
import { ActionableEntity } from "../actionable-entity.js";
import { getActPrompt, getSystemPrompt } from "./prompts.js";

class CollectFirewoodActionHandler implements ActionHandler {
  supports(action: Action): boolean {
    return action.type === "collect_firewood";
  }
  handle(action: CollectFirewoodAction, npc: NPC): void {
    npc.increaseFirewood(action.kg);
  }
}

export class NPC extends ActionableEntity {
  private messageHistory: Message[] = [];

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly lifeGoal: string,
    private readonly actions: string[],
    private firewoodKg: number,
  ) {
    super(`NPC ${name}`);
    this.registerActionHandler(new CollectFirewoodActionHandler());
  }

  async initialise() {
    this.messageHistory.push({
      content: getSystemPrompt(this.name, this.lifeGoal, this.actions),
      sender: "user",
    });
    const response = await this.llm.generateResponse(this.messageHistory);
    this.logger.info(
      `NPC ${this.name} initialisation, response: ${JSON.stringify(response)}`,
    );
    return response;
  }

  async act(totalFirewoodKg: number): Promise<Action | null> {
    this.messageHistory.push({
      content: getActPrompt(this.firewoodKg, totalFirewoodKg),
      sender: "user",
    });
    return this.llm.generateResponse(this.messageHistory);
  }

  public increaseFirewood(kg: number) {
    this.firewoodKg = +kg;
  }
}
