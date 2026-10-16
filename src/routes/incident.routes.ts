import { Router } from "express";
import { IncidentController } from "../controllers/incident.controller";

const router = Router();

router.get("/", IncidentController.getAll);
router.post("/", IncidentController.create);
router.patch("/:id", IncidentController.update);

export default router;