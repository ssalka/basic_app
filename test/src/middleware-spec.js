const middleware = require('src/server/routes/middleware');

describe("middleware", () => {

  describe("#findUserByToken", () => {
    it("gets the session token or sends back a 403");
    it("finds the session and returns the user");
    it("sends an error if no session is found");
    it("logs caught errors");
  });

  describe("#registerUser", () => {
    it("registers a new user and calls next");
    it("won't register a user if the username is already taken");
    it("sends errors to the client");
  });

  describe("#loginUser", () => {
    it("authenticates the user");
    it("rejects invalid login credentials");
  });

  describe("#startSession", () => {
    it("inserts a new session into the database");
    it("sets the user and session token on req.session");
    it("calls next");
  });

  describe("#loginSuccess", () => {
    it("sends the user and session token to the client");
  });

  describe("#closeSession", () => {
    it("finds the session and closes it");
    it("logs caught errors");
  });

  describe("#logout", () => {
    it("logs the user out");
    it("sends the username back to the client");
  });

  describe("#getUser", () => {
    it("sends the user to the client");
    it("sends an error if req.user is undefined");
  });

});
