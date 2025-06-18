import type { EventType } from "./event.js";

export type Action = {
  type: EventType;
};

export const collectFirewoodPrompt: string = `
    If you have less than 50 kg of firewood, collect it.
    IMPORTANT: You can only collect firewood if the world has more than 10 kg available. If the world has 10 kg or less, you MUST choose to rest instead.
`;
