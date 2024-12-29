import chaiHttp from "@utils/chai-http.util";
import { SinonSandbox, createSandbox } from "sinon";
import User from "@models/user.model";
import { StatusCodes } from "http-status-codes";
import jsonwebtoken from "jsonwebtoken";
import Match from "@models/match.model";

describe("Match", () => {
  describe("Get My Match", () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("Error - Database Error", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      Match.findAll = sandbox.stub().throws("Error");
      const res = await chaiHttp.GET({
        url: "/api/v1/matches",
        cookie: "token=validToken",
      });

      res.should.have.status(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("Success - Get My Match List", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      Match.findAll = sandbox.stub().resolves([
        {
          id: 2,
          email: "tes@email.com",
        },
      ]);
      const res = await chaiHttp.GET({
        url: "/api/v1/matches",
        cookie: "token=validToken",
      });

      res.should.have.status(StatusCodes.OK);
      res.body.should.have.property("message").eq("Successfully fetched matches");
    });
  });
});
