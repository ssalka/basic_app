import * as async from 'async';
import * as _ from 'lodash';
import * as passport from 'passport';

import { User, Session } from 'lib/server/models';
import { generateToken } from 'lib/server/utils';

export function findUserByToken(req, res) {
  const { token } = req.session;

  if (!token) {
    return res.status(403).send('No session token was provided');
  }

  async.waterfall(
    [
      cb => Session.findByToken(token).exec(cb),
      (session, cb) =>
        _.isEmpty(session)
          ? cb({ message: 'No matching document', statusCode: 404 })
          : User.findByIdAndPopulate(session.user).exec(cb)
    ],
    (err, user) =>
      err
        ? res.status(err.statusCode || 500).send(err.message || err)
        : res.json({ user: user.toObject() })
  );
}

export function registerUser(req, res, next) {
  const { username, password } = req.body;
  const user = new User({ username });
  User.register(user, password, err => (err ? res.status(500).json({ err }) : next()));
}

export function loginUser(req, res, next) {
  passport.authenticate('local')(req, res, next);
}

export function startSession(req, res, next) {
  Session.create(
    {
      user: _.pick(req.user, ['_id', 'username']),
      token: generateToken()
    },
    (err, sess) => {
      if (err) {
        return next(err);
      }

      _.assign(req.session, _.pick(sess, ['user', 'token']));
      next();
    }
  );
}

export function loginSuccess(req, res, next) {
  const { token } = req.session;

  User.findByIdAndPopulate(req.user._id)
    .then(user =>
      res.json({
        token,
        user: user.toObject()
      })
    )
    .catch(next);
}

export function closeSession(req, res, next) {
  Session.findByToken(req.session.token)
    .then((session, err) => {
      if (err || !session) {
        return next(err || 'Session not found');
      }

      async.parallel(
        [cb => session.remove(cb), cb => req.session.destroy(cb)],
        err => (err ? next(err) : next())
      );
    })
    .catch(err => {
      res.status(500).json({ err });
    });
}

export function logout(req, res) {
  const { username } = req.user;
  req.logout();
  res.json({ username });
}
