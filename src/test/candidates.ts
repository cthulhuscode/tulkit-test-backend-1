process.env.NODE_ENV = "testing";
import chai from "chai";
import chaiHttp from "chai-http";
import { app as server } from "../..";
import { seeder } from "../utils/seeder";

const should = chai.should();
chai.use(chaiHttp);

describe("Candidates - Test cases", function () {
  before(async function () {
    // Seed the database
    await seeder();
  });

  describe("/GET Candidates", function () {
    it("Shouldn't retrieve a candidate if skills were not provided", async function () {
      const response = await chai.request(server).get("/candidates/best");

      response.should.have.status(400);
      response.should.be.an("object");
      response.body.success.should.be.false;
    });
    it("Shouldn't retrieve any candidate if no candidate was found with the required skills", async function () {
      const response = await chai
        .request(server)
        .get("/candidates/best/?skills=aaa&skills=bbb");

      response.should.have.status(404);
      response.should.be.an("object");
      response.body.success.should.be.false;
    });
    it("Should retrieve the candidate who has the most skills from the list provided", async function () {
      const response = await chai
        .request(server)
        .get("/candidates/best/?skills=java&skills=golang&skills=scala");

      response.should.have.status(200);
      response.should.be.an("object");
      response.body.success.should.be.true;
      response.body.data[0].should.include.all.keys(["_id", "name", "skills"]);
    });
  });

  describe("/POST Candidates", function () {
    it("Shouldn't add candidate if no data is provided", async function () {
      const response = await chai.request(server).post("/candidates").send();

      response.should.have.status(400);
      response.should.be.an("object");
      response.body.success.should.be.false;
    });
    it("Shouldn't add candidate if there are missing fields", async function () {
      const candidate = [
        {
          name: "",
          skills: ["node"],
        },
      ];

      const response = await chai
        .request(server)
        .post("/candidates")
        .send(candidate);

      response.should.have.status(400);
      response.should.be.an("object");
      response.body.success.should.be.false;
    });
    it("Should add candidates, generate an id, retrieve correct status code", async function () {
      const candidates = [
        {
          name: "Alison",
          skills: ["node"],
        },
        {
          name: "Erick",
          skills: ["cobol"],
        },
      ];

      const response = await chai
        .request(server)
        .post("/candidates")
        .send(candidates);

      response.should.have.status(201);
      response.should.be.an("object");
      response.body.success.should.be.true;
      response.body.data[0].should.include.all.keys(["_id", "name", "skills"]);
    });
  });
});
