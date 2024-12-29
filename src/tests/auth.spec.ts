import chaiHttp from "@utils/chai-http.util";
import { SinonSandbox, createSandbox } from "sinon";
import User from "@models/user.model";
import { StatusCodes } from "http-status-codes";
import bcryptJs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import ERROR_CODES from "@constants/error.const";

describe("Authentication", () => {
  describe("Login User", () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it("Error - Failed to login - User not found", async () => {
      sandbox.stub(User, "findOne").resolves(null);
      const res = await chaiHttp.POST({
        url: "/api/v1/auth/login",
        body: {
          email: "bagus.andreanto@gmail.com",
          password: "123456",
        },
      });
      res.should.have.status(ERROR_CODES.AUTH_INVALID_EMAIL_OR_PASSWORD.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.AUTH_INVALID_EMAIL_OR_PASSWORD.message);
      res.body.should.have.property("code").eq(ERROR_CODES.AUTH_INVALID_EMAIL_OR_PASSWORD.errorCode);
    });

    it("Error - Failed to login - Invalid email or password", async () => {
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });

      sandbox.stub(bcryptJs, "compareSync").returns(false);

      const res = await chaiHttp.POST({
        url: "/api/v1/auth/login",
        body: {
          email: "bagus.andreanto@gmail.com",
          password: "wrong-password",
        },
      });

      res.should.have.status(ERROR_CODES.AUTH_INVALID_EMAIL_OR_PASSWORD.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.AUTH_INVALID_EMAIL_OR_PASSWORD.message);
      res.body.should.have.property("code").eq(ERROR_CODES.AUTH_INVALID_EMAIL_OR_PASSWORD.errorCode);
    });

    it("Success - Successfully to login", async () => {
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });

      sandbox.stub(bcryptJs, "compareSync").returns(true);

      const res = await chaiHttp.POST({
        url: "/api/v1/auth/login",
        body: {
          email: "bagus.andreanto@gmail.com",
          password: "123456",
        },
      });

      res.should.have.status(StatusCodes.OK);
      res.body.should.have.property("message").eq("Login successful");
    });
  });

  describe("Get Current User", () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });
    it("Error - Failed to get current user - Auth token not given", async () => {
      const res = await chaiHttp.GET({
        url: "/api/v1/auth/me",
      });

      res.should.have.status(ERROR_CODES.AUTH_UNAUTHORIZED.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.AUTH_UNAUTHORIZED.message);
      res.body.should.have.property("code").eq(ERROR_CODES.AUTH_UNAUTHORIZED.errorCode);
    });

    it("Error - Failed to get current user - Invalid token", async () => {
      sandbox.stub(jsonwebtoken, "verify").returns(null);
      
      const res = await chaiHttp.GET({
        url: "/api/v1/auth/me",
        cookie: "token=invalid",
      });
      res.should.have.status(ERROR_CODES.AUTH_UNAUTHORIZED.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.AUTH_UNAUTHORIZED.message);
      res.body.should.have.property("code").eq(ERROR_CODES.AUTH_UNAUTHORIZED.errorCode);
    });

    it("Error - Failed to get current user - User not found", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves(null);
      const res = await chaiHttp.GET({
        url: "/api/v1/auth/me",
        cookie: "token=validToken",
      });
      res.should.have.status(ERROR_CODES.AUTH_UNAUTHORIZED.httpStatus);
      res.body.should.have.property("message").eq(ERROR_CODES.AUTH_UNAUTHORIZED.message);
      res.body.should.have.property("code").eq(ERROR_CODES.AUTH_UNAUTHORIZED.errorCode);
    });

    it("Success - Get Current User", async () => {
      jsonwebtoken.verify = sandbox.stub().returns({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      User.findOne = sandbox.stub().resolves({
        id: 1,
        email: "bagus.andreanto@gmail.com",
      });
      const res = await chaiHttp.GET({
        url: "/api/v1/auth/me",
        cookie: "token=validToken",
      });

      res.should.have.status(StatusCodes.OK);
      res.body.should.have.property("message").eq("User found");
      res.body.data.should.have.property("email").eq("bagus.andreanto@gmail.com");
    });
  });
});
