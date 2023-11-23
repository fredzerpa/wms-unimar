const {
  getBills,
  getBillById,
  createBill,
  updateBillById,
  deleteBillById,
  upsertBillsByBundle,
} = require('../../models/bills/bills.model');

const httpGetBills = async (req, res) => {
  const { search } = req.query;

  try {
    // TODO: add search
    // const response = search ? await getBillBySearch(search) : await getBills();
    const response = await getBills();
    return res.status(200).json(response);

  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch Bill',
      message: error.message,
    });
  }
}

const httpGetBill = async (req, res) => {
  const { id } = req.params;
  try {
    return res.status(200).json(await getBillById(id));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to fetch Bill',
      message: error.message,
    });
  }
}

const httpCreateBill = async (req, res) => {
  const recordData = req.body;


  try {
    return res.status(201).json(await createBill(recordData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create new Bill',
      message: error.message,
    });
  }
}

const httpUpdateBill = async (req, res) => {
  const recordId = req.params.id;
  const updateData = req.body;

  try {
    return res.status(200).json(await updateBillById(recordId, updateData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to update Bill',
      message: error.message,
    });
  }
}

const httpDeleteBill = async (req, res) => {
  const recordId = req.params.id;

  try {
    return res.status(200).json(await deleteBillById(recordId));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to delete Bill',
      message: error.message,
    });
  }
}

const httpCreateBillsByBundle = async (req, res) => {
  const bundle = req.body;

  if (!Array.isArray(bundle))
    return res.status(400).json({
      code: 400,
      error: 'Data is not bundled',
      message: 'The passed data is not an Array of data',
    });

  try {
    return res.status(201).json(await upsertBillsByBundle(bundle));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create bundle of Bill',
      message: error.message,
    });
  }
}

module.exports = {
  httpGetBills,
  httpGetBill,
  httpCreateBill,
  httpCreateBillsByBundle,
  httpUpdateBill,
  httpDeleteBill,
};
