const users = require('./users.mongo');

const getUsers = async () => {
  return await users.find();
}

const createUser = async (userData) => {
  return await users.create(userData);
}

const updateUserById = async (userId, updateData) => {
  const options = {
    new: true, // Retorna el Usuario con los datos actualizados
    runValidators: true, // Aplica las validaciones del User Schema otra vez
  };

  return await users.findByIdAndUpdate(userId, updateData, options);
}

const updateUserByEmail = async (email, updateData) => {
  const options = {
    new: true, // Retorna el Usuario con los datos actualizados
    runValidators: true, // Aplica las validaciones del User Schema otra vez
  };

  return await users.findOneAndUpdate({ email }, updateData, options);
}

const deleteUserByEmail = async (email) => {
  return await users.findOneAndDelete({ email });
}

const getUserById = async (id) => {
  return await users.findById(id);
}

const getUserByEmail = async (email) => {
  return await users.findOne({ email });
}

const userExists = async ({ email }) => {
  return await users.exists({ email });
}

const getUserBySearch = async (search) => {
  return await users
    .find({})
    .or([
      { email: new RegExp(search, 'gi') },
    ]);
}

module.exports = {
  getUsers,
  createUser,
  updateUserById,
  updateUserByEmail,
  deleteUserByEmail,
  userExists,
  getUserById,
  getUserByEmail,
  getUserBySearch,
};
