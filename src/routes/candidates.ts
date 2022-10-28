import { Router } from "express";
import {
  getCandidates,
  getBestCandidate,
  createCandidate,
} from "../controllers/candidates";

const router = Router();

router.get("/", getCandidates);
router.get("/best", getBestCandidate);
router.post("/", createCandidate);

export default router;
