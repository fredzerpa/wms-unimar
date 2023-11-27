const { upsertInventoryRecordsByFields } = require('../../models/inventory/inventory.model');
const {
  getShippings,
  getShippingById,
  createShipping,
  updateShippingById,
  deleteShippingById,
  upsertShippingsByBundle,
} = require('../../models/shippings/shippings.model');
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12)

const httpGetShippings = async (req, res) => {
  const { search } = req.query;

  try {
    // TODO: add search
    // const response = search ? await getShippingBySearch(search) : await getShippings();
    const response = await getShippings();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch Shipping',
      message: error.message,
    });
  }
}

const httpGetShipping = async (req, res) => {
  const { id } = req.params;
  try {
    return res.status(200).json(await getShippingById(id));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch Shipping',
      message: error.message,
    });
  }
}

const httpCreateShipping = async (req, res) => {
  try {
    const recordData = req.body;
    recordData.code = nanoid();
    
    // await upsertInventoryRecordsByFields(["code", "name", "type", ])

    return res.status(201).json(await createShipping(recordData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create new Shipping',
      message: error.message,
    });
  }
}

const httpUpdateShipping = async (req, res) => {
  const recordId = req.params.id;
  const updateData = req.body;

  try {
    return res.status(200).json(await updateShippingById(recordId, updateData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to update Shipping',
      message: error.message,
    });
  }
}

const httpDeleteShipping = async (req, res) => {
  const recordId = req.params.id;

  try {
    return res.status(200).json(await deleteShippingById(recordId));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to delete Shipping',
      message: error.message,
    });
  }
}

const httpCreateShippingsByBundle = async (req, res) => {
  const bundle = req.body;

  if (!Array.isArray(bundle))
    return res.status(400).json({
      code: 400,
      error: 'Data is not bundled',
      message: 'The passed data is not an Array of data',
    });

  try {
    return res.status(201).json(await upsertShippingsByBundle(bundle));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create bundle of Shipping',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetShippings,
  httpGetShipping,
  httpCreateShipping,
  httpCreateShippingsByBundle,
  httpUpdateShipping,
  httpDeleteShipping,
};
