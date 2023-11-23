const {
  getStores,
  createStore,
  updateStoreById,
  deleteStoreById,
  getStoreById,
  upsertStoresByBundle,
} = require('../../models/stores/stores.model');

async function httpGetStores(req, res) {
  const { search } = req.query;

  try {
    // TODO: add search
    // const response = search ? await getStoreBySearch(search) : await getStores();
    const response = await getStores();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch stores',
      message: error.message,
    });
  }
}

async function httpGetStore(req, res) {
  const { id } = req.params;
  try {
    return res.status(200).json(await getStoreById(id));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch stores',
      message: error.message,
    });
  }
}

async function httpCreateStore(req, res) {
  const StoreData = req.body;


  try {
    return res.status(201).json(await createStore(StoreData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create new Store',
      message: error.message,
    });
  }
}

async function httpUpdateStore(req, res) {
  const StoreId = req.params.id;
  const updateData = req.body;


  try {
    return res.status(200).json(await updateStoreById(StoreId, updateData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to update Store',
      message: error.message,
    });
  }
}

async function httpDeleteStore(req, res) {
  const StoreId = req.params.id;


  try {
    return res.status(200).json(await deleteStoreById(StoreId));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to delete Store',
      message: error.message,
    });
  }
}

async function httpCreateStoresByBundle(req, res) {
  const bundle = req.body;

  if (!Array.isArray(bundle))
    return res.status(400).json({
      code: 400,
      error: 'Data is not bundled',
      message: 'The passed data is not an Array of data',
    });


  try {
    return res.status(201).json(await upsertStoresByBundle(bundle));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create bundle of Store',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetStores,
  httpGetStore,
  httpCreateStore,
  httpCreateStoresByBundle,
  httpUpdateStore,
  httpDeleteStore,
};
