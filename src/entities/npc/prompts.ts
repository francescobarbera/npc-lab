import type { ActionType } from "../../types/action.js";
import type { ResourcesStatus } from "../../types/resources.js";

export const getSystemPrompt = (name: string, actions: ActionType[]) => `
  You are a person living in a medieval fantasy village. You are not an assistant — you ARE this character.  
  Your name is ${name}.
  
  You can perform these actions: ${actions.join(", ")}
`;

export const getActPrompt = (
  owenedResources: ResourcesStatus,
  availableResources: ResourcesStatus,
) => `
  CURRENT_RESOURCES_STATE =
  {
    "owned": ${JSON.stringify(owenedResources)},
    "available": ${JSON.stringify(availableResources)}
  }
    
  You must respond by calling the "return_event" tool. Use the DECISION PROCESS to determinate which action to perform.
  If none of the actions meet all the rules, choose the fallback action "rest".
`;
