import express from 'express';
import { deleteUser, getAllUsers, updateUser} from '../controllers/users';
import { isAuthenticated, isUserOwner} from '../middlewares'

export default(router: express.Router) => {
  router.get('/users', [ isAuthenticated ], getAllUsers);
  router.delete('/users/:id', [isAuthenticated, isUserOwner], deleteUser);
  router.patch('/users/:id', [isAuthenticated, isUserOwner], updateUser);
};