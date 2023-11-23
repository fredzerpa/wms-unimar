const {
  getProviders,
  createProvider,
  updateProviderById,
  deleteProviderById,
  getProviderById,
  upsertProvidersByBundle,
} = require('../../models/providers/providers.model');

async function httpGetProviders(req, res) {
  const { search } = req.query;

  try {
    // TODO: add search
    // const response = search ? await getProviderBySearch(search) : await getProviders();
    const response = await getProviders();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch providers',
      message: error.message,
    });
  }
}

async function httpGetProvider(req, res) {
  const { id } = req.params;
  try {
    return res.status(200).json(await getProviderById(id));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch providers',
      message: error.message,
    });
  }
}

async function httpCreateProvider(req, res) {
  const ProviderData = req.body;


  try {
    return res.status(201).json(await createProvider(ProviderData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create new Provider',
      message: error.message,
    });
  }
}

async function httpUpdateProvider(req, res) {
  const ProviderId = req.params.id;
  const updateData = req.body;


  try {
    return res.status(200).json(await updateProviderById(ProviderId, updateData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to update Provider',
      message: error.message,
    });
  }
}

async function httpDeleteProvider(req, res) {
  const ProviderId = req.params.id;


  try {
    return res.status(200).json(await deleteProviderById(ProviderId));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to delete Provider',
      message: error.message,
    });
  }
}

async function httpCreateProvidersByBundle(req, res) {
  const bundle = req.body;

  if (!Array.isArray(bundle))
    return res.status(400).json({
      code: 400,
      error: 'Data is not bundled',
      message: 'The passed data is not an Array of data',
    });


  try {
    return res.status(201).json(await upsertProvidersByBundle(bundle));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create bundle of Provider',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetProviders,
  httpGetProvider,
  httpCreateProvider,
  httpCreateProvidersByBundle,
  httpUpdateProvider,
  httpDeleteProvider,
};
