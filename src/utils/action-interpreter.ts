import type {
  LLMInterface,
  NPCMessage,
} from "../dependencies-interfaces/llm.js";
import type { ActionType } from "../types/action.js";

type ActionInterpreter = {
  parse: (message: NPCMessage) => Promise<ActionType | null>;
};

const createActionInterpreter = (() => {
  let instance: ActionInterpreter | null = null;

  return (actions: ActionType[], llm: LLMInterface): ActionInterpreter => {
    if (!instance) {
      instance = {
        parse: (message: NPCMessage) => llm.parseAction(actions, message),
      };
    }

    return instance;
  };
})();

export { createActionInterpreter };
