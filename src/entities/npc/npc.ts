import type {
  LLMInterface,
  Message,
} from "../../dependencies-interfaces/llm.js";
import type { Action, ActionType } from "../../types/action.js";
import { ActionableEntity } from "../actionable-entity.js";
import type { ResourcesStatus } from "../../types/resources.js";
import { getActPrompt } from "./prompts.js";
import { ActionHandler } from "./actionHandler.js";
import { filterAvailableResources } from "../../utils/filterAvailableResources.js";

export class NPC extends ActionableEntity {
  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly actions: ActionType[],
    initialResources: Partial<ResourcesStatus>,
    private readonly goal: Partial<ResourcesStatus>,
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
  }

  async act(availableResources: ResourcesStatus): Promise<Action | null> {
    const messages: Message[] = [
      {
        content: getActPrompt(
          this.name,
          [
            ...Object.keys(filterAvailableResources(availableResources)).map(
              (a) => `collect_${a}`,
            ),
            "rest",
          ],
          filterAvailableResources(this._resources),
          filterAvailableResources(availableResources),
          this.goal,
        ),
        sender: "npc",
      },
    ];
    const response = await this.llm.generateResponse(messages);
    if (response === null) {
      return null;
    }

    const actionType = await this.llm.detectActionType(this.actions, response);
    if (actionType === null) {
      return null;
    }

    this.logger.info(`ACTION: ${actionType} MOTIVATION: ${response.content}`);

    return {
      type: actionType,
      reason: response.content,
      actor: this,
    };
  }
}
