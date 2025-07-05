import type {
  LLMInterface,
  Message,
} from "../../dependencies-interfaces/llm.js";
import type { Action, ActionType } from "../../types/action.js";
import { ActionableEntity } from "../actionable-entity.js";
import type { ResourcesStatus } from "../../types/resources.js";
import { getActPrompt, getSystemPrompt } from "./prompts.js";
import { ActionHandler } from "./actionHandler.js";

export class NPC extends ActionableEntity {
  private messageHistory: Message[] = [];

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly actions: ActionType[],
    initialResources: Partial<ResourcesStatus> = {},
  ) {
    super(`NPC ${name}`, initialResources);
    this.registerActionHandlers([
      new ActionHandler("collect_gold", "gold"),
      new ActionHandler("collect_firewood", "firewood"),
      new ActionHandler("collect_stone", "stone"),
      new ActionHandler("collect_iron", "iron"),
      new ActionHandler("collect_grain", "grain"),
      new ActionHandler("collect_water", "water"),
      new ActionHandler("collect_clay", "clay"),
      new ActionHandler("collect_wool", "wool"),
      new ActionHandler("collect_fish", "fish"),
      new ActionHandler("collect_herbs", "herbs"),
    ]);
    this.messageHistory.push({
      content: getSystemPrompt(this.name, this.actions),
    });
  }

  async act(availableResources: ResourcesStatus): Promise<Action | null> {
    this.messageHistory.push({
      content: getActPrompt(this._resources, availableResources),
      sender: "npc",
    });
    const response = await this.llm.generateResponse(this.messageHistory);
    if (response === null) {
      return null;
    }

    const actionType = await this.llm.detectActionType(this.actions, response);
    if (actionType === null) {
      return null;
    }

    return {
      type: actionType,
      reason: response.content,
      actor: this,
    };
  }
}
