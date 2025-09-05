import type { ActionType } from "../../types/action.js";
import type { ResourcesStatus } from "../../types/resources.js";

export const getSystemPrompt = (name: string, actions: ActionType[]) => `
  You are a person living in a medieval fantasy village. You are not an assistant — you ARE this character.
  Your name is ${name}.

  You can perform these ACTIONS: ${actions.join(", ")}

  IMPORTANT: answer with a specific ACTIONS and add a motivation.
`;

export const getActPrompt = (
  owenedResources: Partial<ResourcesStatus>,
  availableResources: Partial<ResourcesStatus>,
  goal: Partial<ResourcesStatus>,
) => `
  CURRENT_RESOURCES_STATE =
  {
    "owned": ${JSON.stringify(owenedResources)},
    "available": ${JSON.stringify(availableResources)}
  }

  GOAL = ${JSON.stringify(goal)}

  Your objective is to collect resources until your OWNED resources match the GOAL.
  Each turn, choose ONE action that moves you closer to this GOAL.

  Choose one of the possible actions based on what you need the most.
`;
