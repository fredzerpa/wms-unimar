const { default: mongoose } = require('mongoose');
const { upsertInventoryRecordsByFields, getInventoryRecordById } = require('../../models/inventory/inventory.model');
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
const { DateTime } = require('luxon');

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
  const { userProfile } = res.locals;

  try {
    const shippingData = req.body;

    shippingData._id = new mongoose.Types.ObjectId();
    shippingData.code = nanoid();
    shippingData.metadata = {
      issuedAt: DateTime.now().setLocale("es-ES").toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),
      issuedBy: userProfile._id
    }

    const updatedInventoryRecordsForShipping = (await Promise.allSettled(shippingData.products.map(async product => {
      const { inventoryRef, quantity } = product;
      const { onStock } = await getInventoryRecordById(inventoryRef);
      return {
        _id: inventoryRef,
        onStock: onStock - quantity,
        shipped: [shippingData._id],
      }
    }))).map(res => res.value);

    await upsertInventoryRecordsByFields(updatedInventoryRecordsForShipping)

    return res.status(201).json(await createShipping(shippingData));
  } catch (error) {
    return res.status(502).json({ // DB Threw error
      error: 'Failed to create new Shipping',
      message: error.message,
    });
  }
}

const httpUpdateShipping = async (req, res) => {
  const shippingId = req.params.id;
  const shippingData = req.body;

  try {
    const formerShippingData = await getShippingById(shippingId);

    const inventoryRecordsIdToCheck = new Set([
      ...shippingData.products.map(product => product.inventoryRef),
      ...formerShippingData.products.map(product => product.inventoryRef.toString()),
    ]);

    // Update Shipping products in the Inventory
    const inventoryRecordsForUpdate = await shippingData.products.reduce(async (recordForUpdate, product, idx, arr) => {
      const { inventoryRef, quantity } = product;
      const formerInventoryRecordData = await getInventoryRecordById(inventoryRef);
      const formerProductShippedQuantity = formerShippingData?.products.find(shippedProduct => shippedProduct.inventoryRef.toString() === product.inventoryRef)?.quantity ?? 0;

      // This way we can check for any missing Inventory Record left out
      inventoryRecordsIdToCheck.delete(inventoryRef);


      const update = [...await recordForUpdate];
      const recordShippingsIds = [...new Set([...formerInventoryRecordData?.shipped?.map(({ _id }) => _id.toString()), shippingId])]
      update.push({
        _id: inventoryRef,
        onStock: formerProductShippedQuantity + formerInventoryRecordData.onStock - quantity,
        shipped: recordShippingsIds,
      })

      // Check for any left Inventory Record to update (deleted product from shipping, etc)
      if (idx + 1 === arr.length && inventoryRecordsIdToCheck.size > 0) {
        const updateForDeletedShippingsProducts = (await Promise.allSettled([...inventoryRecordsIdToCheck].map(async inventoryId => {
          const deletedShippedProductData = formerShippingData.products.find(shippedProduct => (
            inventoryId === shippedProduct.inventoryRef.toString()
          ));

          const formerInventoryRecordData = await getInventoryRecordById(inventoryId);

          return {
            _id: inventoryId,
            onStock: formerInventoryRecordData.onStock + deletedShippedProductData.quantity,
            shipped: formerInventoryRecordData.shipped?.filter(shipping => shipping._id.toString() !== deletedShippedProductData._id),
          }
        }))).map(res => res.value);

        update.push(...updateForDeletedShippingsProducts)
      }

      return update;

    }, [])

    await upsertInventoryRecordsByFields(inventoryRecordsForUpdate)

    return res.status(200).json(await updateShippingById(shippingId, shippingData));
  } catch (error) {
    console.log(error);
    return res.status(502).json({ // DB Threw error
      error: 'Failed to update Shipping',
      message: error.message,
    });
  }
}

const httpDeleteShipping = async (req, res) => {
  const shippingId = req.params.id;

  try {
    const formerShippingData = await getShippingById(shippingId);

    // Get inventory records with data updated from the deletion of the Shipping
    const inventoryRecordsUpdated = (await Promise.allSettled(formerShippingData.products.map(async product => {
      const { inventoryRef, quantity } = product;
      const formerInventoryRecordData = await getInventoryRecordById(inventoryRef);

      return {
        _id: inventoryRef,
        onStock: formerInventoryRecordData.onStock + quantity,
        shipped: formerInventoryRecordData.shipped?.filter(shipping => shipping._id.toString() !== shippingId)
      }
    }))).map(res => res.value)

    await upsertInventoryRecordsByFields(inventoryRecordsUpdated)


    return res.status(200).json(await deleteShippingById(shippingId));
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
