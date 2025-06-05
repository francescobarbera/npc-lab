import type { NPC } from "./npc";

export type EventType = "world_interaction" | "npcs_interaction";

export type ActionType = "buy" | "sell" | "collect_firewood";

export type ItemType = "firewood";

/*
 * Events describes the interaction between npcs or between npcs and the world.
 * The world is responsible to keep a list of events.
 * NPCs can permorm actions that are directly mapped to events.
 */
type BaseEvent = {
  type: EventType;
  loopNumber: number;
  npc: NPC;
};

/*
 * Events to shape the actions the NPCs can do in the world
 */
type BaseActionEvent = BaseEvent & {
  type: "world_interaction";
  actionType: ActionType;
};

type CollectFirewood = BaseEvent & {
  type: "world_interaction";
  actionType: "collect_firewood";
  quantity: number;
};

/*
 * Events to shape the interactions between NPCs
 */
type BaseNPCsInteractionEvent = BaseEvent & {
  type: "npcs_interaction";
};

type GoldExchangeEvent = Omit<BaseEvent, "npc"> & {
  type: "npcs_interaction";
  seller: NPC;
  buyer: NPC;
  good: ItemType;
};

export type Event = CollectFirewood | GoldExchangeEvent;
