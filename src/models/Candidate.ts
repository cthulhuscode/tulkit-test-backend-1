import { Schema, model } from "mongoose";
import { ICandidate } from "../interfaces/ICandidate";

const CandidateSchema = new Schema<ICandidate>({
  name: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
});

const CandidateModel = model("candidates", CandidateSchema);
export default CandidateModel;
