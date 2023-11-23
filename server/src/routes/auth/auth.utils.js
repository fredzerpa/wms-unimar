const jwt = require('jsonwebtoken');
const Users = require('../../models/users/users.model');
const { DateTime } = require('luxon');
const { formDataToObj } = require('../../utils/functions.utils');
require('dotenv').config();

const { JWT_USERS_SECRET_KEY } = process.env;

const checkUserAuth = async (req, res, next) => {
  try {
    // We obtain the token to verify the user
    const bearer = req.headers?.authorization;
    const token = bearer?.split(' ')[1];

    const userProfile = jwt.verify(token, JWT_USERS_SECRET_KEY);

    const userAccount = await Users.getUserByEmail(userProfile.email);
    if (!userAccount) throw new Error('Datos de usuario invalidos');

    // Passing a variable from one middelware to another
    res.locals.userProfile = userAccount.toObject({ versionKey: false });

    return next(); // If there is no error, the user is authorized
  } catch (error) {
    return res.status(401).json({
      error: 'Usuario no autorizado',
      message: error.message,
    })
  }
}

const checkUserPrivilegesAccess = (privilege = 'users', access = 'read') => async (req, res, next) => {
  try {
    // We obtain the user profile from the checkUserAuth middleware
    const { userProfile } = res.locals;

    // Get privileges
    const accessAllowed = userProfile.privileges[privilege][access];
    if (!accessAllowed) throw new Error('Privilegios insuficientes')

    // Verify privileges on account updates
    const accessingAdminPrivilege = privilege === 'users' && access !== 'read';
    if (accessingAdminPrivilege) {
      const { email } = req.params; // Any update on the path /api/users will be done directly by email (/api/users/:email).
      const updateData = formDataToObj(req.body);
      const userToUpdate = await Users.getUserByEmail(email);

      // Supervisores, y dar permisos de Administrador, solo son editables por Administradores
      const givingAdminPrivileges = updateData?.isAdmin;
      const givingPartialAdminPrivileges = updateData?.privileges?.users?.upsert || updateData?.privileges?.users?.delete;

      const adminActionsList = [
        givingAdminPrivileges,
        givingPartialAdminPrivileges,
      ]

      // Validate admin action
      if (userToUpdate?.isAdmin || (!userProfile.isAdmin && adminActionsList.some(Boolean))) throw new Error('Privilegios insuficientes')
    }

    return next(); // User is authorized
  } catch (error) {
    return res.status(403).json({
      error: 'Usuario no autorizado',
      message: error.message,
    })
  }
}

const getUserByEmailAndPassword = async (email, password) => {
  const userAccount = await Users.getUserByEmail(email);

  const passwordMatched = await userAccount?.comparePassword(password);

  if (!passwordMatched) throw new Error('Correo y/o contraseña incorrecta');

  return userAccount;
}

// Verify that the user is allowed by the administrator
const userExists = async (userData) => {
  // If the user is added to the DB then it was allowed by the Administrator.
  return await Users.userExists(userData);
}

const setUserCookieSession = (req, res, data) => {
  try {

    return res.cookie(
      'user',
      data, // We save the token in a session to read the user's data when logging in again.
      {
        maxAge: DateTime.now().plus({ weeks: 2 }).diffNow('milliseconds'), // Expires in 2 weeks
        sameSite: true,
        httpOnly: true,
        signed: true,
      }
    );
  } catch (err) {
    throw new Error('No se pudo crear el Cookie de Sesion de Usuario')
  }

}

module.exports = {
  checkUserAuth,
  checkUserPrivilegesAccess,
  userExists,
  getUserByEmailAndPassword,
  setUserCookieSession
}