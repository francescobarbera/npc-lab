import type {
  LLMInterface,
  Message,
} from "../../dependencies-interfaces/llm.js";
import type { Action } from "../action.js";
import { ActionableEntity } from "../actionable-entity.js";
import { resources, type ResourcesStatus } from "../resources.js";
import { CollectFirewoodActionHandler } from "./actions-handlers/collectFirewood.js";
import { getActPrompt, getSystemPrompt } from "./prompts.js";

export class NPC extends ActionableEntity {
  private messageHistory: Message[] = [];

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly actions: string[],
    initialResources: Partial<ResourcesStatus> = {},
  ) {
    super(`NPC ${name}`, initialResources);
    this.registerActionHandler(new CollectFirewoodActionHandler());
  }

  async initialise() {
    this.messageHistory.push({
      content: getSystemPrompt(this.name, this.actions),
      sender: "user",
    });
    const response = await this.llm.generateResponse(this.messageHistory);
    this.logger.info(
      `NPC ${this.name} initialisation, response: ${JSON.stringify(response)}`,
    );
  }

  async act(totalFirewoodKg: number): Promise<Action | null> {
    this.messageHistory.push({
      content: getActPrompt(this._resources.firewood, totalFirewoodKg),
      sender: "user",
    });
    return this.llm.generateResponse(this.messageHistory);
  }
}
