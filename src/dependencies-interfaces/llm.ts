import type { ActionType } from "../types/action.js";

export type WorldMessage = {
  content: string;
  sender: "world";
};

export type NPCMessage = {
  content: string;
  sender: "npc";
};

export type SystemMessage = {
  content: string;
};

export type Message = WorldMessage | NPCMessage | SystemMessage;

export function isWorldMessage(message: Message): message is WorldMessage {
  return (message as WorldMessage).sender === "world";
}

export function isNPCMessage(message: Message): message is NPCMessage {
  return (message as NPCMessage).sender === "npc";
}

export function isSystemMessage(message: Message): message is SystemMessage {
  return !("sender" in message);
}

export interface LLMInterface {
  generateResponse(
    messages: (SystemMessage | WorldMessage)[],
  ): Promise<NPCMessage | null>;
  detectActionType(
    actions: ActionType[],
    message: NPCMessage,
  ): Promise<ActionType | null>;
}
