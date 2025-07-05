export const generateNPCActiveResponse = (resource: string) => {
  const sentencePool = [
    `Since ${resource} is plentiful, I choose to collect ${resource}`,
    `There’s enough ${resource} available, so I opt to collect ${resource}`,
    `With sufficient ${resource} present, I decide to collect ${resource}`,
    `${resource} supplies are adequate, so I will collect ${resource}`,
    `Because there is enough ${resource}, I’m going to collect ${resource}`,
    `The ${resource} reserves are sufficient, so I choose to collect ${resource}`,
    `As there’s plenty of ${resource}, I decide to collect ${resource}`,
    `Given the abundance of ${resource}, I opt to collect ${resource}`,
    `${resource} is in good supply, so I will collect ${resource}`,
    `Seeing that ${resource} is enough, I decide to collect ${resource}`,
  ];

  return sentencePool[Math.floor(Math.random() * sentencePool.length)];
};

export const generateNPCRestResponse = () => {
  const sentencePool = [
    "I’m taking a break for a few hours to recover my strength. I heard whispers about a nearby village full of gold and iron, but I’ll need full energy to go after it.",
    "Before I start collecting again, I need some rest. There’s talk of a village nearby with plenty of gold and iron, and I want to be ready.",
    "I’m pausing to regain my energy. Rumor has it there’s a stash of gold and iron in a nearby settlement, and I’ll need to be at my best to get it.",
    "I’ll rest for a while before gathering more. A village rich in gold and iron may be close, but I’m too drained to explore it now.",
    "I’ve decided to rest first. There are rumors of gold and iron nearby, but I won’t stand a chance unless I’m fully recharged.",
  ];

  return sentencePool[Math.floor(Math.random() * sentencePool.length)];
};
