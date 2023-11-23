const jwt = require('jsonwebtoken')
const { getUserByEmailAndPassword, userExists, setUserCookieSession } = require('../../routes/auth/auth.utils');
require('dotenv').config();

const { JWT_USERS_SECRET_KEY } = process.env;

const signInWithEmailAndPassword = async (req, res) => {
  try {
    const { email, password, session } = req.body;

    // Obtenemos el perfil del usuario de nuestra BD
    const userAccount = (await getUserByEmailAndPassword(email, password))?.toJSON();

    const token = jwt.sign(userAccount, JWT_USERS_SECRET_KEY);

    // Creamos una sesion para poder loguear al usuario cuando vuelva
    if (session) setUserCookieSession(req, res, token);

    return res.status(200).json({ token, ...userAccount });
  } catch (error) {
    res.status(400).json({
      error: 'Error al iniciar sesion con Email y Contraseña',
      message: error.message
    })
  }
}

const checkSession = async (req, res) => {
  try {

    const { user: token } = req.signedCookies;

    if (!token) return res.status(200).send(null); // Enviamos null ya que nuestro context del cliente registrara este valor como usuario

    const userProfile = jwt.verify(token, JWT_USERS_SECRET_KEY);

    // Solo usuarios pre-creados pueden loguearse
    if (!(await userExists(userProfile))) {
      return res.status(401).json({
        error: 'Sesion invalida',
        message: 'Usuario invalido'
      });
    }

    return res.status(200).json({ token, ...userProfile });
  } catch (error) {
    return res.status(400).json({
      error: 'Sesion invalida',
      message: error.message
    })
  }
}

const logout = async (req, res) => {
  return res.clearCookie('user').redirect('/');
}

module.exports = {
  signInWithEmailAndPassword,
  checkSession,
  logout
}