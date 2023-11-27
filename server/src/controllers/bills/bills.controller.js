const {
  getBills,
  getBillById,
  createBill,
  updateBillById,
  deleteBillById,
  upsertBillsByBundle,
} = require('../../models/bills/bills.model');
const { upsertInventoryRecords, createInventoryRecord, updateInventoryRecordById } = require('../../models/inventory/inventory.model');
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12)

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
  const billData = req.body;

  billData.code = nanoid();

  const productsForInventory = billData.products.map(product => {
    const { quantity, expirationDate, discount, subtotal, unitCost, ...rest } = product;
    return {
      product: rest,
      onStock: quantity,
      entryDate: billData.date,
      expirationDate,
    }
  })
  const createdInventoryRecords = await createInventoryRecord(productsForInventory);

  billData.products = billData.products.map(product => {
    const createdRecord = createdInventoryRecords.find(record => (
      record?.product.name + record?.product.type + record?.product?.typeClass === product.name + product.type + product?.typeClass
    ));

    return {
      ...product,
      inventoryRefId: createdRecord._id,
    }
  })

  try {
    return res.status(201).json(await createBill(billData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create new Bill',
      message: error.message,
    });
  }
}

const httpUpdateBill = async (req, res) => {
  const billId = req.params.id;
  const billData = req.body;

  const updatedProducts = await updateInventoryRecordById()

  try {
    return res.status(200).json(await updateBillById(billId, billData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to update Bill',
      message: error.message,
    });
  }
}

const httpDeleteBill = async (req, res) => {
  const billId = req.params.id;

  try {
    return res.status(200).json(await deleteBillById(billId));
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
