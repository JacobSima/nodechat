import express from 'express';
import authentication from './authentication';
import users from './users';
import chats from './chats';
import statics from './statics';

const router = express.Router();

export default () : express.Router => {
  statics(router);
  authentication(router);
  users(router);
  chats(router);

  return router;
};
