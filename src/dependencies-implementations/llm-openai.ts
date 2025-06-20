import OpenAI from "openai";
import type { LLMInterface, Message } from "../dependencies-interfaces/llm.js";
import {
  isSystemMessage,
  isUserMessage,
} from "../dependencies-interfaces/llm.js";
import type { Action } from "../entities/action.js";

export class OpenAIImplementation implements LLMInterface {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async generateResponse(messages: Message[]): Promise<Action | null> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: messages.map((message) => ({
          role: isSystemMessage(message)
            ? "system"
            : isUserMessage(message)
              ? "user"
              : "assistant",
          content: message.content,
        })),
        model: "gpt-3.5-turbo-1106",
        tools: [
          {
            type: "function",
            function: {
              name: "return_event",
              description: "Return an action in the correct format",
              parameters: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["collect_firewood", "rest"],
                  },
                },
                required: ["type"],
              },
            },
          },
        ],
        tool_choice: "required",
      });

      const toolCall = completion.choices[0].message.tool_calls?.[0];

      if (!toolCall) {
        return null;
      }

      return JSON.parse(toolCall.function.arguments);
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate response from OpenAI");
    }
  }
}
