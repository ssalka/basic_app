import * as _ from 'lodash';
import * as middleware from 'lib/server/middleware';
import * as models from 'lib/server/models';
import { MockCollection, MockUser } from 'lib/server/models/mocks';
import { generateToken } from 'lib/server/utils';
import { Collection as ICollection, User as IUser } from 'lib/common/interfaces';

describe('User Middleware', () => {
  let req: Record<string, any>;
  let res: Record<string, any>;
  let next: (err?) => void;
  let Session;
  let User;
  let populatedUser;

  beforeEach(() => {
    req = {};
    res = {};
  });

  describe('#findUserByToken', () => {
    const user: Partial<IUser> = { username: 'test_user' };
    const session = { user, token: generateToken() };

    beforeEach(() => {
      const json = jest.fn();
      const send = jest.fn();
      const status = jest.fn().mockReturnValue(res);

      ({ Session, User } = models);
      _.assign(req, _.cloneDeep({ session }));
      _.assign(res, { json, send, status });

      populatedUser = new User({
        ...user,
        library: {
          collections: [new MockCollection()]
        }
      });
    });

    it('finds the session and returns the user', () => {
      Session.findByToken = jest.fn(() => ({
        exec: cb => cb(null, session)
      }));

      User.findByIdAndPopulate = jest.fn(() => ({
        exec: cb => cb(null, populatedUser)
      }));

      middleware.user.findUserByToken(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        user: populatedUser.toObject()
      });
    });

    it('sends an error if no session is found', () => {
      const err = 'No matching document';
      Session.findByToken = jest.fn(() => ({
        exec: cb => cb(null, null)
      }));

      middleware.user.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(err);
    });

    it('sends back a 403 if there is no session token', () => {
      const err = 'No session token was provided';
      delete req.session.token;

      middleware.user.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith(err);
    });

    it('logs caught errors', () => {
      const err = 'something is wrong';
      Session.findByToken = jest.fn(() => ({
        exec: cb => cb(err)
      }));

      middleware.user.findUserByToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(err);
    });
  });

  describe('#registerUser', () => {
    beforeEach(() => {
      const json = jest.fn();
      const body = {
        username: 'test_user',
        password: 'test_pass'
      };

      ({ User } = models);
      _.assign(req, { body });
      _.assign(res, { json });
      next = jest.fn();
    });

    it('registers a new user and calls next', () => {
      User.register = jest.fn((username, password, cb) => cb(null));

      middleware.user.registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('sends errors to the client', () => {
      const err = 'you cant do that';
      User.register = jest.fn(() => res.json({ err }));

      middleware.user.registerUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ err });
    });
  });

  describe('#startSession', () => {
    let session;
    const user: Partial<IUser> = {
      _id: 'userId',
      username: 'test_user'
    };

    beforeEach(() => {
      ({ Session } = models);
      Session.create = jest.fn((sess, cb) => {
        session = _.pick(sess, ['user', 'token']);
        cb(null, sess);
      });

      _.assign(req, { session: {}, user });
      next = jest.fn();
    });

    it('inserts a new session into the database', () => {
      middleware.user.startSession(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });

    it('sets the user and session token on req.session', () => {
      middleware.user.startSession(req, res, next);

      expect(req.session).toEqual(session);
    });
  });

  describe('#loginSuccess', () => {
    const session = {
      token: generateToken()
    };
    const user: Partial<IUser> = {
      _id: 'userId',
      username: 'test_user'
    };

    beforeEach(() => {
      const json = jest.fn();
      _.assign(req, { session, user });
      _.assign(res, { json });

      populatedUser = new User({
        ...user,
        library: {
          collections: [new MockCollection()]
        }
      });
    });

    it('sends the user and session token to the client', () => {
      User.findByIdAndPopulate = jest.fn(() => ({
        then: cb => (cb(populatedUser), { catch: _.noop })
      }));

      middleware.user.loginSuccess(req, res);

      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toEqual({
        token: session.token,
        user: populatedUser.toObject()
      });
    });
  });

  describe('#closeSession', () => {
    const session = {};

    beforeEach(() => {
      ({ Session } = models);

      _.assign(session, {
        token: generateToken(),
        remove: jest.fn(cb => cb())
      });
      _.assign(req, _.cloneDeep({ session }));

      req.session.destroy = jest.fn(cb => cb());
      next = jest.fn();
    });

    it('finds the session and closes it', () => {
      Session.findByToken = jest.fn(() => ({
        then(cb) {
          cb(session);

          return this;
        },
        catch: jest.fn()
      }));

      middleware.user.closeSession(req, res, next);

      expect(session.remove).toHaveBeenCalled();
      expect(req.session.destroy).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0]).toEqual([]);
    });

    it('calls next if no session is found', () => {
      Session.findByToken = jest.fn(() => ({
        then(cb) {
          cb(null);

          return this;
        },
        catch: jest.fn()
      }));

      middleware.user.closeSession(req, res, next);

      expect(next).toHaveBeenCalledWith('Session not found');
    });

    it('sends caught errors to the client', () => {
      const err = 'could not close session';
      Session.findByToken = jest.fn(() => ({
        then() {
          return this;
        },
        catch: cb => cb(err)
      }));

      _.assign(res, {
        status: jest.fn(() => res),
        json: jest.fn()
      });

      middleware.user.closeSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ err });
    });
  });

  describe('#logout', () => {
    beforeEach(() => {
      _.assign(req, {
        user: { username: 'test_user' },
        logout() {
          delete req.user;
        }
      });

      res.json = jest.fn();
    });

    it('logs the user out', () => {
      middleware.user.logout(req, res);

      expect(req.user).toBeUndefined();
    });

    it('sends the username back to the client', () => {
      const { username } = req.user;

      middleware.user.logout(req, res);

      expect(res.json.mock.calls[0][0]).toEqual({ username });
    });
  });
});
