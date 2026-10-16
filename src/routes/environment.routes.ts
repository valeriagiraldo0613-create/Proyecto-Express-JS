import { Router } from "express";
import { EnvironmentController } from "../controllers/environment.controller";

const router = Router();

router.get("/", EnvironmentController.getAll);
router.post("/", EnvironmentController.create);
router.patch("/:id", EnvironmentController.update);

export default router;