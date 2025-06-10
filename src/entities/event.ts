import type { NPC } from "./npc.js";
import type { World } from "./world.js";

export type EventType = "collect_firewood" | "rest";

/*
 * The event describes the something that happened in the world.
 * It has a list of associated targets, they could be npcs or the world.
 * The npcs and the world have to react to the event.
 */
type BaseEvent = {
  type: EventType;
  iteration: number;
  target: (NPC | World)[];
};

type CollectFirewoodEvent = BaseEvent & {
  type: "collect_firewood";
  kg: number;
};

type RestEvent = BaseEvent & {
  type: "rest";
};

export type Event = CollectFirewoodEvent | RestEvent;
