import { Router } from "express";
import { getAmenities, healthCheck } from "../controllers/metaController";

const router = Router();

router.get("/amenities", getAmenities);
router.get("/health", healthCheck);

export default router;
