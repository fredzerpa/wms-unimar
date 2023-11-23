const { uploadFileToBucket, deleteFileFromBucket } = require('../../api/AWS/AWS.api');
const {
  getUsers,
  createUser,
  deleteUserByEmail,
  getUserById,
  getUserBySearch,
  getUserByEmail,
  updateUserByEmail,
} = require('../../models/users/users.model');
const { randomUUID } = require('crypto');
const jwt = require('jsonwebtoken');
const { formDataToObj, encrypt } = require('../../utils/functions.utils');
const { setUserCookieSession } = require('../../routes/auth/auth.utils');

const httpGetUsers = async (req, res) => {
  const { search } = req.query;

  try {
    // TODO: add search
    // const response = search ? await getUserBySearch(search) : await getUsers();
    const response = await getUsers();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Error al extraer usuarios',
      message: error.message,
    });
  }
}

const httpGetUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const fetchedUser = await getUserById(id);
    return res.status(200).json(fetchedUser);
  } catch (error) {
    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Error al extraer usuarios',
      message: error.message,
    });
  }
}

const httpCreateUser = async (req, res) => {
  const userData = formDataToObj(req.body);
  const imageFile = req?.files?.imageUrl;

  try {
    // TODO: add image creation
    // if (imageFile) {
    //   const imageExt = imageFile.name.split('.').at(-1);
    //   const imageName = `${randomUUID()}.${imageExt}`;

    //   const uploadUserImage = await uploadFileToBucket({
    //     filePath: imageFile.data,
    //     keyName: imageName,
    //     bucketName: 'elangel-datahub-images',
    //   }, {
    //     ContentEncoding: imageFile.encoding,
    //     ContentType: imageFile.mimetype
    //   })

    //   if (!uploadUserImage.ok) {
    //     return res.status().json({
    //       error: '',
    //       message: uploadUserImage.error,
    //     })
    //   }

    //   userData.imageUrl = `https://elangel-datahub-images.s3.amazonaws.com/${imageName}`
    // }
    const userCreated = await createUser(userData);
    return res.status(201).json(userCreated);
  } catch (error) {
    if (error?.code) {
      const MONGO_ERR_CODES = {
        11000: `${Object.values(error?.keyValue || {})[0]} ya existe`
      }
      return res.status(502).json({ // Base de Datos tiro un error
        error: 'Error al crear usuario',
        message: MONGO_ERR_CODES[error.code] || error.message,
      });
    }

    return res.status(502).json({ // Base de Datos tiro un error
      error: 'Error al crear usuario',
      message: error.message,
    });
  }
}

const httpConfirmPassword = async (req, res) => {
  // Obtenemos el perfil del usuario del checkUserAuth middleware
  const { userProfile } = res.locals;
  const { password } = req.body;

  try {
    const userAccount = await getUserByEmail(userProfile.email);
    const confirmed = await userAccount.comparePassword(password);
    return res.status(200).send(confirmed);
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Error al verificar contraseña',
      message: error.message,
    });
  }
}

const httpUpdateUserByEmail = async (req, res) => {
  const email = req.params.email;
  const updateData = formDataToObj(req.body);
  const imageFile = req?.files?.imageUrl;

  try {
    // TODO: update image url
    // Si se envio una imagen nueva entonces se guarda la imagen en AWS y se registra su URL
    // if (imageFile) {
    //   const imageExt = imageFile.name.split('.').at(-1);
    //   const imageName = `${randomUUID()}.${imageExt}`;

    //   const uploadUserImage = await uploadFileToBucket({
    //     filePath: imageFile.data,
    //     keyName: imageName,
    //     bucketName: 'elangel-datahub-images',
    //   }, {
    //     ContentEncoding: imageFile.encoding,
    //     ContentType: imageFile.mimetype
    //   })

    //   if (!uploadUserImage.ok) throw new Error(uploadUserImage.error);

    //   updateData.imageUrl = `https://elangel-datahub-images.s3.amazonaws.com/${imageName}`
    // }

    // // Eliminamos la imagen de AWS S3 si fue eliminada por el cliente
    // const userToUpdate = await getUserByEmail(email);
    // if (userToUpdate?.imageUrl?.includes('elangel-datahub-images') && updateData.imageUrl === "") { // * En events se actualiza solamente los privilegios por lo que se usa ===
    //   await deleteFileFromBucket({
    //     keyName: userToUpdate.imageUrl.split('/').at(-1),
    //     bucketName: 'elangel-datahub-images',
    //   });
    // }

    if (updateData?.password) updateData.password = await encrypt(updateData.password);
    else delete updateData.password; // Si no hemos enviado una contraseña entonces la eliminamos
    
    const userUpdated = await updateUserByEmail(email, updateData);

    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Error al actualizar usuario',
      message: error.message,
    });
  }
}

const httpUpdateSelfUser = async (req, res) => {
  // Obtenemos el perfil del usuario del checkUserAuth middleware
  const { userProfile } = res.locals;

  const updateData = formDataToObj(req.body);
  delete updateData.isAdmin; // El usuario no puede actualizar sus propios privilegios
  delete updateData.privileges; // El usuario no puede actualizar sus propios privilegios
  delete updateData.password; // El usuario no puede actualizar la clave en esta ruta

  const imageFile = req?.files?.imageUrl;

  try {
    // TODO: add image file
    // if (imageFile) {
    //   const imageExt = imageFile.name.split('.').at(-1);
    //   const imageName = `${randomUUID()}.${imageExt}`;

    //   const uploadUserImage = await uploadFileToBucket({
    //     filePath: imageFile.data,
    //     keyName: imageName,
    //     bucketName: 'elangel-datahub-images',
    //   }, {
    //     ContentEncoding: imageFile.encoding,
    //     ContentType: imageFile.mimetype
    //   })

    //   if (!uploadUserImage.ok) throw new Error(uploadUserImage.error);

    //   updateData.imageUrl = `https://elangel-datahub-images.s3.amazonaws.com/${imageName}`
    // }

    // // * En la ruta 'events' se actualiza solamente los privilegios por lo que se usa ===
    // if (userProfile?.imageUrl?.includes('elangel-datahub-images') && updateData.imageUrl === "") {
    //   await deleteFileFromBucket({
    //     keyName: userProfile.imageUrl.split('/').at(-1),
    //     bucketName: 'elangel-datahub-images',
    //   });
    // }

    const userUpdated = (await updateUserByEmail(userProfile.email, updateData)).toJSON();

    // Como se cambio los datos del usuario es necesario realizar los cambios de sesion tambien
    const token = jwt.sign(userUpdated, process.env.JWT_USERS_SECRET_KEY);
    setUserCookieSession(req, res, token);

    return res.status(200).json({ token, ...userUpdated });
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Error al actualizar usuario',
      message: error.message,
    });
  }
}

const httpChangePassword = async (req, res) => {
  // Obtenemos el perfil del usuario del checkUserAuth middleware
  const { userProfile } = res.locals;
  const { oldPassword, newPassword } = formDataToObj(req.body);
  try {
    const userAccount = await getUserByEmail(userProfile.email);
    const confirmedPassword = await userAccount.comparePassword(oldPassword);
    if (!confirmedPassword) {
      return res.status(400).json({
        error: 'Error al cambiar la clave',
        message: 'Contraseña incorrecta',
      })
    }

    const newPasswordHashed = await encrypt(newPassword);
    const userUpdated = await updateUserByEmail(userAccount.email, { password: newPasswordHashed });
    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Error al cambiar la clave',
      message: error.message,
    });
  }
}

const httpDeleteUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {

    const deletedUser = await deleteUserByEmail(email)
    // TODO: add image delete
    // Si posee una imagen en nuestro AWS la eliminamos
    // const imageStoredInBucket = deletedUser?.imageUrl?.includes('elangel-datahub-images');
    // if (imageStoredInBucket) {
    //   await deleteFileFromBucket({
    //     keyName: deletedUser.imageUrl.split('/').at(-1),
    //     bucketName: 'elangel-datahub-images',
    //   });
    // }
    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(502).json({ // Base de datos tiro un error
      error: 'Error al eliminar usuario',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetUsers,
  httpGetUserById,
  httpCreateUser,
  httpUpdateUserByEmail,
  httpUpdateSelfUser,
  httpConfirmPassword,
  httpChangePassword,
  httpDeleteUserByEmail,
};
