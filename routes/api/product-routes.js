const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const allProducts = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!allProducts) {
      res.status(404).json({ message: "Item not found, try again!" });
      return;
    }

    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productArray = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productArray);
      }
      res.status(200).json(product);
    })
    .then((productIDs) => res.status(200).json(productIDs))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/:id", (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productIDs = productTags.map(({ tag_id }) => tag_id);
      const newProducts = req.body.tagIds
        .filter((tag_id) => !productIDs.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const removableProducts = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: removableProducts } }),
        ProductTag.bulkCreate(newProducts),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  try {
    const allProducts = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!allProducts) {
      res.status(404).json({ message: "Item not found, try again!" });
      return;
    }

    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
