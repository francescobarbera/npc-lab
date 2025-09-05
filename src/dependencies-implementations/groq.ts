import type {
  LLMInterface,
  NPCMessage,
  SystemMessage,
  WorldMessage,
} from "../dependencies-interfaces/llm.js";
import { isSystemMessage } from "../dependencies-interfaces/llm.js";
import type { ActionType } from "../types/action.js";
import { Groq } from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export class GroqImplementation implements LLMInterface {
  private groq;
  private model: string;

  constructor(model = "moonshotai/kimi-k2-instruct") {
    this.model = model;
    this.groq = new Groq({
      apiKey: GROQ_API_KEY,
    });
  }

  async generateResponse(
    messages: (SystemMessage | WorldMessage)[],
  ): Promise<NPCMessage | null> {
    try {
      const resp = await this.groq.chat.completions.create({
        model: this.model,
        messages: messages.map((m) => ({
          role: isSystemMessage(m) ? "system" : "user",
          content: m.content,
        })),
        stream: false,
      });

      const msg = resp.choices[0]?.message;
      const content = msg?.content;

      if (!content) return null;

      return {
        content: content,
        sender: "npc" as const,
      };
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate response from Groq");
    }
  }

  async detectActionType(
    availableActions: ActionType[],
    message: NPCMessage,
  ): Promise<ActionType | null> {
    try {
      const systemPrompt = `
        You are an action parser. Your task is to analyze a message and extract the specific action the user wants to perform.

        Valid Actions:
        ${availableActions.map((action) => `- "${action}"\n`).join("")}

        Instructions:
        Read the user's message carefully
        Identify which action they want to perform based on the context
        Return ONLY the exact action string from the list above
        If multiple actions are mentioned, return the primary/first action mentioned

        Examples:
        Input: "Since gold is plentiful, I choose to collect gold"
        Output: collect_gold
        Input: "With sufficient herbs present, I decide to collect herbs"
        Output: collect_herbs
        Input: "As there's plenty of wool, I decide to collect wool"
        Output: collect_wool
        Input: "I need to gather some firewood for the winter"
        Output: collect_firewood
        Input: "Let me rest for a while"
        Output: rest
        Input: "I want to mine some iron ore from the mountains"
        Output: collect_iron
        Input: "Time to catch some fish by the river"
        Output: collect_fish


        Response Format:
        CRITICAL Your entire response must be exactly one of these strings with nothing else:
        ${availableActions.join(", ")}

        Your Task:
        Parse the following message and return only the action string:
      `;

      const resp = await this.groq.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `
            ${systemPrompt}
            ${message.content}
          `,
          },
        ],
        stream: false,
      });

      const msg = resp.choices[0]?.message;
      const content = msg?.content;

      if (!content || !availableActions.includes(content as ActionType)) {
        return null;
      }

      return content as ActionType;
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate response from LM Studio");
    }
  }
}
