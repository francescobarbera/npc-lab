import type { LLMInterface, Message } from "../dependencies-interfaces/llm.js";
import Logger from "../utils/logger.js";
import type { Action } from "./action.js";
import type { Event } from "./event.js";

export class NPC {
  private messageHistory: Message[] = [];
  private logger: Logger;

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly lifeGoal: string,
    private readonly actions: string,
    private firewoodKg: number,
  ) {
    this.logger = new Logger(`NPC ${name}`);
  }

  private getInitialPrompt(): string {
    return `
            ${this.lifeGoal}
            Actions you can perform: ${this.actions}
            Current firewoodKg: ${this.firewoodKg}
            What do you do?
            Decide what to do this turn. You must respond by calling the "return_event" tool to describe your chosen action..
        `;
  }

  async initialise() {
    this.messageHistory.push({
      content: this.getInitialPrompt(),
      sender: "user",
    });
    const response = await this.llm.generateResponse(this.messageHistory);
    // TODO: handle the first response
    this.logger.info(
      `NPC ${this.name} initialisation, response: ${JSON.stringify(response)}`,
    );
    return response;
  }

  async act(totalFirewoodKg: number): Promise<Action | null> {
    this.messageHistory.push({
      content: `
                Based on your parameters (firewoodKg: ${this.firewoodKg}), and the world firewood available (${totalFirewoodKg} kg) what is your next action? 
                IMPORTANT: You can only collect firewood if the world has more than 10 kg available. If the world has 10 kg or less, you MUST choose to rest instead.
                Decide what to do this turn. You must respond by calling the "return_event" tool to describe your chosen action.
            `,
      sender: "user",
    });
    return this.llm.generateResponse(this.messageHistory);
  }

  handleEvent(event: Event) {
    if (event.target.includes(this)) {
      this.logger.info(`Handle event ${event.type}`);
      switch (event.type) {
        case "collect_firewood":
          this.firewoodKg += event.kg;
          break;
      }
      this.logger.info(`FirewoodKg: ${this.firewoodKg}`);
    }
  }
}
