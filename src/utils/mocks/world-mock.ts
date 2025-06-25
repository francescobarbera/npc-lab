import { World } from "../../entities/world/world.js";
import { resources, type ResourcesStatus } from "../../types/resources.js";

export class WorldMock extends World {
  constructor() {
    super(
      "mock_world",
      Object.fromEntries(resources.map((r) => [r, 100])) as ResourcesStatus,
    );
  }
}
