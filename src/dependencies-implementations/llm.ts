import OpenAI from "openai";
import type { LLMInterface, Message } from "../dependencies-interfaces/llm";
import { isSystemMessage, isUserMessage } from "../dependencies-interfaces/llm";

export class OpenAIImplementation implements LLMInterface {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async generateResponse(messages: Message[]): Promise<string> {
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
              description: "Return an event in the correct format",
              parameters: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["world_interaction", "npcs_interaction"],
                  },
                  actionType: {
                    type: "string",
                    enum: ["collect_firewood", "rest"],
                  },
                },
                required: ["type", "actionType"],
              },
            },
          },
        ],
        tool_choice: "required",
      });

      const toolCall = completion.choices[0].message.tool_calls?.[0];

      if (!toolCall) {
        return "No response generated";
      }

      return toolCall.function.arguments;
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate response from OpenAI");
    }
  }
}
