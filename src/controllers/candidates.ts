import { NextFunction, Request, Response } from "express";
import Candidate from "../models/Candidate";
import { asyncHandler } from "../middleware/asyncHandler";
import { ErrorResponse } from "../utils/errorResponse";

/**
 * @desc Get all the candidates
 * @route GET /candidates
 * @access Public
 */
export const getCandidates = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const candidates = await Candidate.find({});

    if (!candidates)
      return next(new ErrorResponse("Unable to retrieve the candidates", 404));

    res.status(200).json({ sucess: true, data: candidates });
  }
);

/**
 * @desc Get the best candidate
 * @route GET /candidates/best
 * @access Public
 */
export const getBestCandidate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const querySkills = req.query.skills as string[];

    // Send error if skills aren't provided
    if (!querySkills)
      return next(
        new ErrorResponse("It's required to specify the skills", 400)
      );

    const candidates = await Candidate.find({ skills: { $in: querySkills } });

    // Send error if db doesn't have any candidate
    if (!candidates || candidates.length === 0)
      return next(new ErrorResponse("No candidate was found", 404));

    const candSkillsCount: { [name: string]: number } = {};

    // Count the candidate skills that match the required skills
    for (let candidate of candidates) {
      for (let cSkill of candidate.skills) {
        if (querySkills.includes(cSkill))
          candSkillsCount[candidate.id] =
            (candSkillsCount[candidate.id] || 0) + 1;
      }
    }

    // If no candidate has been found who meets the provided skills
    if (Object.entries(candSkillsCount).length === 0)
      return res.status(404).json({
        success: false,
        data: [],
        error: "No candidate has been found who meets the provided skills",
      });

    // Get the candidate with the most skills
    let maxCount = 0;
    let bestCandidate = "";
    for (let candidate in candSkillsCount) {
      if (candSkillsCount[candidate] > maxCount) {
        maxCount = candSkillsCount[candidate];
        bestCandidate = candidate;
      }
    }

    // Get the best candidate data
    const data = candidates.filter(
      (candidate) => candidate.id === bestCandidate
    );

    res.status(200).json({ success: true, data: data });
  }
);

/**
 * @desc Create a new candidate
 * @route POST /candidates
 * @access Public
 */
export const createCandidate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const candidates = req.body;

    // If no data is provided
    if (!candidates || candidates.length === 0)
      return next(
        new ErrorResponse("Please send the candidate's data correctly", 400)
      );

    const response = await Candidate.create(candidates);

    if (!response)
      return next(new ErrorResponse("Unable to create the candidate(s)", 500));

    res.status(201).json({ success: true, data: response });
  }
);
