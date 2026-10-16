import { Router } from "express";
import { EquipmentController } from "../controllers/equipment.controller";

const router = Router();

router.get("/", EquipmentController.getAll);
router.post("/", EquipmentController.create);
router.patch("/:id", EquipmentController.update);

export default router;