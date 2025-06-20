import type { LLMInterface, Message } from "../dependencies-interfaces/llm.js";
import type { Action, ActionHandler, CollectFirewoodAction } from "./action.js";
import { ActionableEntity } from "./actionable-entity.js";

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

  private getSystemPrompt(): string {
    return `
        You are an NPC living in a medieval fantasy village. You are not an assistant - you ARE this character.
        Your Character
        Name: ${this.name}
        Goal: ${this.lifeGoal}
        
        What You Know:
        - Other villagers and their jobs
        - Your own memories and feelings
        - Basic village life
        
        How It Works:
        - Each turn, you take ONE action
        - You can work at your job OR rest
        - Make decisions based on your personality, goal, and current situation
        
        Your Behavior:
        - Act realistic and stay in character
        - Be decisive - no asking questions or listing options
        - Speak casually and naturally
        
        What you can do:
        ${this.actions.map((action) => `- ${action}\n`)}
        
        Your Turn:
        - Think briefly about your current state
        - Choose exactly one action
        - Do that action
        
        Stay in character. Make one clear decision each turn.
        You must respond by calling the "return_event" tool to describe your chosen action.
        For this turn only, decide to use the action 'wake up'.
    `;
  }

  async initialise() {
    this.messageHistory.push({
      content: this.getSystemPrompt(),
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
      content: `
        Based on your parameters (firewoodKg: ${this.firewoodKg}), and the world firewood available (${totalFirewoodKg} kg) what is your next action? 
        IMPORTANT: You can only collect firewood if the world has more than 10 kg available. If the world has 10 kg or less, you MUST choose to rest instead.
        Decide what to do this turn. You must respond by calling the "return_event" tool to describe your chosen action.
    `,
      sender: "user",
    });
    return this.llm.generateResponse(this.messageHistory);
  }

  public increaseFirewood(kg: number) {
    this.firewoodKg = +kg;
  }
}
