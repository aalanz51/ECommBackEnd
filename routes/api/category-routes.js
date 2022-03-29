const router = require("express").Router();
const { Category, Product } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const findAllCats = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(findAllCats);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const specificCat = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    res.status(200).json(specificCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const createCat = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(createCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const catUpdate = await Category.update(
      { category_name: req.body.category_name },
      { where: { id: req.params.id } }
    );
    res.status(200).json(catUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteCat = await Category.destroy({
      where: { id: req.params.id },
    });
    if (!deleteCat) {
      res.status(404).json({ message: "Not found, try again!" });
      return;
    }
    res.status(200).json(deleteCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
