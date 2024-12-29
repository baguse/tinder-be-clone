import chaiHttp from "@utils/chai-http.util";
import { SinonSandbox, createSandbox } from "sinon";
import User from "@models/user.model";
import { StatusCodes } from "http-status-codes";
import ERROR_CODES from "@constants/error.const";
import jsonwebtoken from "jsonwebtoken";
import Match from "@models/match.model";

describe("User", () => {
  describe("Create User", () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it("Error - Failed to create user - Invalid payload", async () => {
      const res = await chaiHttp.POST({
        url: "/api/v1/users",
        body: {},
      });

      res.should.have.status(ERROR_CODES.INVALID_PAYLOAD.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.INVALID_PAYLOAD.message);
      res.body.should.have.property("code").eq(ERROR_CODES.INVALID_PAYLOAD.errorCode);
    });

    it("Error - Failed to create user - Email already exist", async () => {
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      const res = await chaiHttp.POST({
        url: "/api/v1/users",
        body: {
          email: "bagus.andreanto@gmail.com",
          password: "123456",
          name: "Bagus",
          gender: "MALE",
          age: 27,
          location: [112.433106, -7.146507],
          preferredRange: 5000,
          preferredAgeMin: 20,
          preferredAgeMax: 25,
        },
      });

      res.should.have.status(ERROR_CODES.USER_ALREADY_EXISTS.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.USER_ALREADY_EXISTS.message);
      res.body.should.have.property("code").eq(ERROR_CODES.USER_ALREADY_EXISTS.errorCode);
    });

    it("Success - Success to create user", async () => {
      User.findOne = sandbox.stub().resolves(null);
      User.create = sandbox.stub().resolves({
        email: "bagus.andreanto@gmail.com",
        password: "123456",
        name: "Bagus",
        gender: "MALE",
      });
      const res = await chaiHttp.POST({
        url: "/api/v1/users",
        body: {
          email: "bagus.andreanto@gmail.com",
          password: "123456",
          name: "Bagus",
          gender: "MALE",
          age: 27,
          location: [112.433106, -7.146507],
          preferredRange: 5000,
          preferredAgeMin: 20,
          preferredAgeMax: 25,
        },
      });

      res.should.have.status(StatusCodes.CREATED);
      res.body.should.have.property("message").eq("User created");
      res.body.data.email.should.eq("bagus.andreanto@gmail.com");
    });
  });

  describe("Get User List", () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it("Error - Failed to get users list - daily max trial exceeded", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findAll = sandbox.stub().resolves([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
      const res = await chaiHttp.GET({
        url: "/api/v1/users",
        cookie: "token=validToken",
      });
      res.should.have.status(ERROR_CODES.USER_CHANCES_LIMIT_REACHED.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.USER_CHANCES_LIMIT_REACHED.message);
      res.body.should.have.property("code").eq(ERROR_CODES.USER_CHANCES_LIMIT_REACHED.errorCode);
    });

    it("Error - Failed to get users list - all user already swiped", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
        location: {
          coordinates: [112.433106, -7.146507],
        },
      });
      User.findAll = sandbox
        .stub()
        .onFirstCall()
        .resolves([{}]) // get all swiped user
        .onSecondCall()
        .resolves([]); // get remaining user
      const res = await chaiHttp.GET({
        url: "/api/v1/users",
        cookie: "token=validToken",
      });
      res.should.have.status(ERROR_CODES.USER_NO_MORE_MATCHES.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.USER_NO_MORE_MATCHES.message);
      res.body.should.have.property("code").eq(ERROR_CODES.USER_NO_MORE_MATCHES.errorCode);
    });

    it("Success - Success get list for premium user", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto.premium@gmail.com",
        isPremium: true,
        gender: "MALE",
        location: {
          coordinates: [112.433106, -7.146507],
        },
      });
      User.findAll = sandbox
        .stub()
        .onFirstCall()
        .resolves([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]) // get all swiped user
        .onSecondCall()
        .resolves([{}, {}, {}, {}, {}]); // get remaining user
      const res = await chaiHttp.GET({
        url: "/api/v1/users",
        cookie: "token=validToken",
      });
      res.should.have.status(StatusCodes.OK);
    });
  });

  describe("Pass or Like User", () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it("Error - Failed to give a like - User not found", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findByPk = sandbox.stub().resolves(null);
      const res = await chaiHttp.POST({
        url: "/api/v1/users/1/like",
        cookie: "token=validToken",
        body: {},
      });
      res.should.have.status(ERROR_CODES.USER_NOT_FOUND.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.USER_NOT_FOUND.message);
      res.body.should.have.property("code").eq(ERROR_CODES.USER_NOT_FOUND.errorCode);
    });

    it("Error - Failed to give a pass - target user already given for today", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findByPk = sandbox.stub().resolves({});
      Match.findOne = sandbox.stub().resolves({});
      const res = await chaiHttp.POST({
        url: "/api/v1/users/1/like",
        cookie: "token=validToken",
        body: {},
      });
      res.should.have.status(ERROR_CODES.USER_MATCH_ALREADY_EXISTS.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.USER_MATCH_ALREADY_EXISTS.message);
      res.body.should.have.property("code").eq(ERROR_CODES.USER_MATCH_ALREADY_EXISTS.errorCode);
    });

    it("Success - Give a like to an user", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findByPk = sandbox.stub().resolves({});
      Match.findOne = sandbox.stub().resolves(null);
      Match.create = sandbox.stub().resolves({});
      const res = await chaiHttp.POST({
        url: "/api/v1/users/1/like",
        cookie: "token=validToken",
        body: {},
      });
      res.should.have.status(StatusCodes.CREATED);
      res.body.should.have.property("message").eq("Match created");
      res.body.data.isMatch.should.eq(false);
    });

    it("Success - Give a like to an user that also like us", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findByPk = sandbox.stub().resolves({});
      Match.findOne = sandbox.stub().onFirstCall().resolves(null).onSecondCall().resolves({});
      Match.create = sandbox.stub().resolves({});
      const res = await chaiHttp.POST({
        url: "/api/v1/users/1/like",
        cookie: "token=validToken",
        body: {},
      });
      res.should.have.status(StatusCodes.OK);
      res.body.should.have.property("message").eq("It's a match");
      res.body.data.isMatch.should.eq(true);
    });
  });

  describe("Update Current User", () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it("Error - Failed to update current user - invalid payload", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      const res = await chaiHttp.PATCH({
        url: "/api/v1/users",
        cookie: "token=validToken",
        body: {
          invalidField: 1,
        },
      });

      res.should.have.status(ERROR_CODES.INVALID_PAYLOAD.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.INVALID_PAYLOAD.message);
      res.body.should.have.property("code").eq(ERROR_CODES.INVALID_PAYLOAD.errorCode);
    });

    it("Success - Update Password", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
        location: {
          coordinates: [112.433106, -7.146507],
        },
        update: () => {
          // do nothing
        },
      });
      const res = await chaiHttp.PATCH({
        url: "/api/v1/users",
        cookie: "token=validToken",
        body: {
          password: "11111",
        },
      });

      res.should.have.status(StatusCodes.OK);
      res.body.should.have.property("message").eq("User updated");
    });

    it("Success - Update Location", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
        location: {
          coordinates: [112.433106, -7.146507],
        },
        update: () => {
          // do nothing
        },
      });
      const res = await chaiHttp.PATCH({
        url: "/api/v1/users",
        cookie: "token=validToken",
        body: {
          locationLng: "112.433106",
          locationLat: "-7.146507",
        },
      });

      res.should.have.status(StatusCodes.OK);
      res.body.should.have.property("message").eq("User updated");
    });

    it("Success - Update isPremium", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
        location: {
          coordinates: [112.433106, -7.146507],
        },
        update: () => {
          // do nothing
        },
      });
      const res = await chaiHttp.PATCH({
        url: "/api/v1/users",
        cookie: "token=validToken",
        body: {
          isPremium: "true",
        },
      });

      res.should.have.status(StatusCodes.OK);
      res.body.should.have.property("message").eq("User updated");
    });
  });
});
