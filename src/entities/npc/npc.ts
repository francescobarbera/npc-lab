import type {
  LLMInterface,
  Message,
} from "../../dependencies-interfaces/llm.js";
import type { Action } from "../action.js";
import { ActionableEntity } from "../actionable-entity.js";
import { CollectFirewoodActionHandler } from "./actions-handlers/collectFirewood.js";
import { getActPrompt, getSystemPrompt } from "./prompts.js";

export class NPC extends ActionableEntity {
  private messageHistory: Message[] = [];

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly lifeGoal: string,
    private readonly actions: string[],
    private _firewoodKg: number,
  ) {
    super(`NPC ${name}`);
    this.registerActionHandler(new CollectFirewoodActionHandler());
  }

  get firewoodKg(): number {
    return this._firewoodKg;
  }

  public increaseFirewoodKg(kg: number) {
    this._firewoodKg += kg;
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
  }

  async act(totalFirewoodKg: number): Promise<Action | null> {
    this.messageHistory.push({
      content: getActPrompt(this._firewoodKg, totalFirewoodKg),
      sender: "user",
    });
    return this.llm.generateResponse(this.messageHistory);
  }
}
