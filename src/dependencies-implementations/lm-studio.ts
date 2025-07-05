import type {
  LLMInterface,
  NPCMessage,
  SystemMessage,
  WorldMessage,
} from "../dependencies-interfaces/llm.js";
import { isSystemMessage } from "../dependencies-interfaces/llm.js";
import type { ActionType } from "../types/action.js";

export class LMStudioImplementation implements LLMInterface {
  private endpoint: string;
  private model: string;

  constructor(
    endpoint = "http://localhost:1234/v1/chat/completions",
    model = "llama-3.2-1b-instruct",
  ) {
    this.endpoint = endpoint;
    this.model = model;
  }

  async generateResponse(
    messages: (SystemMessage | WorldMessage)[],
  ): Promise<NPCMessage | null> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0,
          messages: messages.map((message) => ({
            role: isSystemMessage(message) ? "system" : "user",
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      const content: string = data?.choices?.[0]?.message?.content;

      if (!content) {
        return null;
      }

      return {
        content,
        sender: "npc",
      };
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate response from LM Studio");
    }
  }

  async parseAction(
    availableActions: ActionType[],
    message: NPCMessage,
  ): Promise<ActionType | null> {
    try {
      const systemPrompt = `
        Action Extraction Prompt:
        You are an action parser. Your task is to analyze a message and extract the specific action the user wants to perform.
        
        Valid Actions:
        ${availableActions.map((action) => `- "${action}"\n`).join("")}
        
        Instructions:
        Read the user's message carefully
        Identify which action they want to perform based on the context
        Return ONLY the exact action string from the list above
        If no clear action can be determined, return "unknown"
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
        
        Note: Each output is ONLY the action string with no quotes, no additional text or formatting.
        
        Response Format:
        CRITICAL Your entire response must be exactly one of these strings with nothing else:
        ${availableActions.join(", ")}
        
        Your Task:
        Parse the following message and return only the action string:
      `;

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0,
          messages: [
            {
              role: "system",
              content: `
              ${systemPrompt}
              ${message.content}
            `,
            },
          ],
        }),
      });

      const data = await response.json();

      const content: string = data?.choices?.[0]?.message?.content;

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
