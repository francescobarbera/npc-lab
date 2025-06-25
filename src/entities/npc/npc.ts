import type {
  LLMInterface,
  Message,
} from "../../dependencies-interfaces/llm.js";
import type { Action, ActionDescriptorType } from "../../types/action.js";
import { ActionableEntity } from "../actionable-entity.js";
import type { ResourcesStatus } from "../../types/resources.js";
import { CollectFirewoodActionHandler } from "./actions-handlers/collectFirewood.js";
import { getActPrompt, getSystemPrompt } from "./prompts.js";

export class NPC extends ActionableEntity {
  private messageHistory: Message[] = [];

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly actions: ActionDescriptorType[],
    initialResources: Partial<ResourcesStatus> = {},
  ) {
    super(`NPC ${name}`, initialResources);
    this.registerActionHandler(new CollectFirewoodActionHandler());
    this.messageHistory.push({
      content: getSystemPrompt(this.name, this.actions),
    });
  }

  async act(availableResources: ResourcesStatus): Promise<Action | null> {
    this.messageHistory.push({
      content: getActPrompt(this._resources, availableResources),
      sender: "user",
    });
    return this.llm.generateResponse(
      this.actions.map((action) => action.type),
      this.messageHistory,
    );
  }
}
