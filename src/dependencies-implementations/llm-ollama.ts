import { Ollama } from "ollama";
import type { LLMInterface, Message } from "../dependencies-interfaces/llm.js";
import {
  isSystemMessage,
  isUserMessage,
} from "../dependencies-interfaces/llm.js";
import type { Action } from "../types/action.js";

export class OllamaImplementation implements LLMInterface {
  private ollama: Ollama;
  private model: string;

  constructor(host = "http://localhost:11434", model = "llama3.2") {
    this.ollama = new Ollama({ host });
    this.model = model;
  }

  async generateResponse(
    actions: string[],
    messages: Message[],
  ): Promise<Action | null> {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        options: {
          temperature: 0,
        },
        messages: messages.map((message) => ({
          role: isSystemMessage(message)
            ? "system"
            : isUserMessage(message)
              ? "user"
              : "assistant",
          content: message.content,
        })),
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
                    enum: actions,
                  },
                  reason: {
                    type: "string",
                    description:
                      "A brief explanation of why this action was chosen",
                  },
                },
                required: ["type", "reason"],
              },
            },
          },
        ],
        format: "json",
      });

      // Handle tool calls if available
      if (
        response.message?.tool_calls &&
        response.message.tool_calls.length > 0
      ) {
        const toolCall = response.message.tool_calls[0];
        return toolCall.function.arguments as Action;
      }

      // Fallback: try to parse JSON from content
      if (response.message?.content) {
        try {
          return JSON.parse(response.message.content) as Action;
        } catch {
          // If parsing fails, return null
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate response from Ollama");
    }
  }
}
