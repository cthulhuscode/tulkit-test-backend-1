import { ICandidate } from "../interfaces/ICandidate";
import Candidate from "../models/Candidate";

export const seeder = async () => {
  const candidate: ICandidate[] = [
    {
      name: "Gerald De Rivia",
      skills: ["node", "javascript", "python", "java"],
    },
    {
      name: "Diana Lenz",
      skills: ["scala", "golang", "java"],
    },
    {
      name: "Catalina Ivanovna",
      skills: ["rust", "node", "java"],
    },
  ];
  return await Candidate.create(candidate);
};
