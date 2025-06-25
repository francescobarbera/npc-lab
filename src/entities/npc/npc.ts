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
  private resources: ResourcesStatus;

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly lifeGoal: string,
    private readonly actions: string[],
    initialResources: Partial<ResourcesStatus> = {},
  ) {
    super(`NPC ${name}`);
    this.registerActionHandler(new CollectFirewoodActionHandler());
    this.resources = Object.assign(
      Object.fromEntries(resources.map((r) => [r, 0])) as ResourcesStatus,
      initialResources,
    );
  }

  get firewoodKg(): number {
    return this.resources.firewood;
  }

  public increaseFirewoodKg(kg: number) {
    this.resources.firewood += kg;
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
      content: getActPrompt(this.resources.firewood, totalFirewoodKg),
      sender: "user",
    });
    return this.llm.generateResponse(this.messageHistory);
  }
}
