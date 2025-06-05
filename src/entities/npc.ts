import type { LLMInterface, Message } from "../dependencies-interfaces/llm";
import Logger from "../utils/logger";

export class NPC {
  private messageHistory: Message[] = [];
  private logger: Logger;

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly lifeGoal: string,
    private readonly actions: string,
    private readonly interactionsWithOthers: string,
    private gold: number,
    private firewoodKg: number,
  ) {
    this.logger = new Logger(`NPC ${name}`);
  }

  async initialise() {
    this.messageHistory.push({
      content: this.getInitialPrompt(),
      sender: "user",
    });
    const response = await this.llm.generateResponse(this.messageHistory);
    this.logger.info(`NPC ${this.name} initialisation, response: ${response}`);
    return response;
  }

  async act() {
    this.logger.info(
      `FirewoodKg: ${this.firewoodKg}, gold: ${this.gold}`,
    );
    this.messageHistory.push({
      content: `Based on your parameters (firewoodKg: ${this.firewoodKg}, gold: ${this.gold}), what is your next action? Decide what to do this turn. You must respond by calling the "return_event" tool to describe your chosen action.`,
      sender: "user",
    });
    const response = await this.llm.generateResponse(this.messageHistory);
    const event = JSON.parse(response);
    if (event.actionType === "collect_firewood") {
      this.firewoodKg += 10;
    }
    this.logger.info(`Action: ${response}`);
    return response;
  }

  getInitialPrompt(): string {
    return `
            ${this.lifeGoal}
            Actions you can perform: ${this.actions}
            Interactions with other people you can perform: ${this.interactionsWithOthers}
            Current gold: ${this.gold}
            Current firewoodKg: ${this.firewoodKg}
            What do you do?
            Decide what to do this turn. You must respond by calling the "return_event" tool to describe your chosen action..
        `;
  }
}
