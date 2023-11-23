const express = require('express');
const { checkUserPrivilegesAccess } = require('../auth/auth.utils');
const {
  httpGetUsers,
  httpGetUserById,
  httpCreateUser,
  httpUpdateUserByEmail,
  httpDeleteUserByEmail,
  httpUpdateSelfUser,
  httpConfirmPassword,
  httpChangePassword,
} = require('../../controllers/users/users.controller');

const usersRouter = express.Router();

// * Tomar en cuenta el orden de las rutas, ya que la respuesta dependera de cual coincida primero
usersRouter.get('/:id', checkUserPrivilegesAccess('users', 'read'), httpGetUserById);
usersRouter.get('/', checkUserPrivilegesAccess('users', 'read'), httpGetUsers);

usersRouter.post('/confirm-password', httpConfirmPassword);
usersRouter.post('/', checkUserPrivilegesAccess('users', 'upsert'), httpCreateUser);

usersRouter.put('/change-password', httpChangePassword);
usersRouter.put('/:email', checkUserPrivilegesAccess('users', 'upsert'), httpUpdateUserByEmail);
usersRouter.put('/', httpUpdateSelfUser);

usersRouter.delete('/:email', checkUserPrivilegesAccess('users', 'delete'), httpDeleteUserByEmail);

module.exports = usersRouter;
