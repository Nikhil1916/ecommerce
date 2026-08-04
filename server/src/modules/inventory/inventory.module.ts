import { InventoryController } from "./controller/inventory.controller";
import InventoryRepository from "./repositories/inventory.repository";
import { InventoryService } from "./services/inventory.service";

const inventoryRepository = new InventoryRepository();
const inventoryService = new InventoryService(inventoryRepository);
const inventoryController = new InventoryController(inventoryService);
const inventoryRoutes = require("./routes/inventory.routes").createInventoryRoutes(inventoryService, inventoryController);
export { inventoryRoutes, inventoryController, inventoryService, inventoryRepository };