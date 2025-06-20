import { World } from "../../entities/world/world.js";

export class WorldMock extends World {
  public decreaseFirewood = () => {};

  constructor() {
    super("mock_world", 10);
  }
}
