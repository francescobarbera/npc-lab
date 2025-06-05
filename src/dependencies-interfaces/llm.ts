export type UserMessage = {
  content: string;
  sender: "user";
  type: string;
};

export type AssistantMessage = {
  content: string;
  sender: "assistant";
  type: string;
};

export type SystemMessage = {
  content: string;
};

export type Message = UserMessage | AssistantMessage | SystemMessage;

export function isUserMessage(message: Message): message is UserMessage {
  return (message as UserMessage).sender === "user";
}

export function isAssistantMessage(
  message: Message,
): message is AssistantMessage {
  return (message as AssistantMessage).sender === "assistant";
}

export function isSystemMessage(message: Message): message is SystemMessage {
  return !("sender" in message);
}

export interface LLMInterface {
  generateResponse(messages: Message[]): Promise<string>;
}
