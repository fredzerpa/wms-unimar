const {
  getInventoryRecords,
  getInventoryRecordById,
  createInventoryRecord,
  updateInventoryRecordById,
  deleteInventoryRecordById,
  upsertInventoryRecordsByBundle,
} = require('../../models/inventory/inventory.model');

const httpGetInventoryRecords = async (req, res) => {
  const { search } = req.query;

  try {
    // TODO: add search
    // const response = search ? await getInventoryRecordBySearch(search) : await getInventoryRecords();
    const response = await getInventoryRecords();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch Inventory Record',
      message: error.message,
    });
  }
}

const httpGetInventoryRecord = async (req, res) => {
  const { id } = req.params;
  try {
    return res.status(200).json(await getInventoryRecordById(id));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch Inventory Record',
      message: error.message,
    });
  }
}

const httpCreateInventoryRecord = async (req, res) => {
  const recordData = req.body;


  try {
    return res.status(201).json(await createInventoryRecord(recordData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create new Inventory Record',
      message: error.message,
    });
  }
}

const httpUpdateInventoryRecord = async (req, res) => {
  const recordId = req.params.id;
  const updateData = req.body;

  try {
    return res.status(200).json(await updateInventoryRecordById(recordId, updateData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to update Inventory Record',
      message: error.message,
    });
  }
}

const httpDeleteInventoryRecord = async (req, res) => {
  const recordId = req.params.id;

  try {
    return res.status(200).json(await deleteInventoryRecordById(recordId));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to delete Inventory Record',
      message: error.message,
    });
  }
}

const httpCreateInventoryRecordsByBundle = async (req, res) => {
  const bundle = req.body;

  if (!Array.isArray(bundle))
    return res.status(400).json({
      code: 400,
      error: 'Data is not bundled',
      message: 'The passed data is not an Array of data',
    });

  try {
    return res.status(201).json(await upsertInventoryRecordsByBundle(bundle));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create bundle of Inventory Record',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetInventoryRecords,
  httpGetInventoryRecord,
  httpCreateInventoryRecord,
  httpCreateInventoryRecordsByBundle,
  httpUpdateInventoryRecord,
  httpDeleteInventoryRecord,
};
