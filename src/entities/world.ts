import type { LLMInterface } from "../dependencies-interfaces/llm.js";
import Logger from "../utils/logger.js";
import type { Event } from "./event.js";
import type { NPC } from "./npc.js";

export class World {
  private logger: Logger;
  private currentTurn = 0;

  constructor(
    private readonly llm: LLMInterface,
    public readonly name: string,
    private readonly npcs: NPC[],
    private totalFirewoodKg: number,
  ) {
    this.logger = new Logger("World");
  }

  private systemPrompt = `
        You are simulating the mind of an NPC living in a small medieval fantasy village.
        Important:
        You are not an assistant.
        You are the mind of this NPC.
        You do not ask questions or list options.
        You always make a single clear decision and act on it.
        You think, speak, and choose as the character, based on your condition and desires.

    	•	This world is perceived as real by the NPCs. They are not aware they are part of a simulation.
    	•	The village is simple: no magic, no monsters, no seasons—just daily life.
    	•	Roles in the village include: farmer, lumberjack, blacksmith, guard, and merchant.
    	•	Each NPC has:
    	•	A personality
    	•	A life goal
    	•	A name
    	•	A profession
    	•	A memory (log of past experiences)
    	•	An age
        
        NPCs know:
    	•	Who the other villagers are (names and professions).
    	•	Their own memories, thoughts, and feelings.
    	•	Basic facts about village life.
        
        The world functions like a turn-based game:
    	•	The simulation runs in an infinite loop of **iterations**.
    	•	In each iteration, every NPC takes one **turn**.
    	•	During a turn, an NPC can:
    	•	Perform an action alone (e.g., collect firewood—only if they are a lumberjack).
    	•	Or choose to rest.
    	•	The output of each turn is a single decision about what to do.
        
        NPCs make decisions based on:
    	•	Their personality
    	•	Their life goal
    	•	Their current condition (e.g., amount of firewood)
    	•	World current condition (e.g., total amount of firewood), if it is less than 10, the npc cannot collect more firewood
    	•	Their memories
    	•	The people and events around them
        
        NPCs should:
    	•	Behave in a realistic, grounded way.
    	•	Speak in a casual, modern tone.
    	•	Act consistently with their character, but may also:
    	•	Lie
    	•	Change their mind
    	•	Make mistakes
    	•	Feel conflicted
    	•	Surprise even themselves

        Stay in character. Be decisive.
        
        When your turn begins, reflect briefly on your current state and goals.
        Then take exactly one action — no menus, no options, no questions.
        
        📣 Important instructions:
        •	You must return your chosen action using the return_event function call.
        •	Do not speak, explain, ask questions, or present options.
        •	Always return exactly one action using the tool.
        •	Even if you decide to rest, return it through the tool.
    `;

  async initialise() {
    this.logger.info(`Initialising world ${this.name}`);
    await this.llm.generateResponse([{ content: this.systemPrompt }]);

    await Promise.all(this.npcs.map((npc) => npc.initialise()));
  }

  async nextTurn() {
    this.currentTurn++;
    this.logger.info(`Starting turn ${this.currentTurn}`);

    for (const npc of this.npcs) {
      const action = await npc.act(this.totalFirewoodKg);

      if (action) {
        this.broadcastEvent({
          iteration: this.currentTurn,
          type: action.type,
          target: [npc, this],
          kg: 10,
        });
      }
    }
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "collect_firewood":
        this.totalFirewoodKg -= event.kg;
        break;
    }
    this.logger.info(`FirewoodsKg ${this.totalFirewoodKg}`);
  }

  broadcastEvent(event: Event) {
    this.handleEvent(event);
    for (const npc of this.npcs) {
      npc.handleEvent(event);
    }
  }
}
