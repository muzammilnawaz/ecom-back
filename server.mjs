import express from "express";
import cors from "cors";
import db from "./db.js";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/api/getProducts", (req, res) => {
  db.query("SELECT * FROM products")
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      res.status(500).send({"message":"Internal Server Error","error":error});
    });

});

app.post("/api/addProduct", (req, res) => {
  const { name, price, description } = req.body;
  let image = req.body.image || "https://placehold.co/400";
  if (!name || !price || !description) {
    return res.status(400).send("required fields are missing");
  }
  db.query(
    "INSERT INTO products (name, price, description, image) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, price, description, image]
  )
    .then((result) => {
      res.status(201).json(result.rows[0]);
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.delete("/api/deleteProduct/:id", (req, res) => {
  let id = req.params.id;
  db.query("DELETE FROM products WHERE id = $1", [id])
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).send("Product not found");
      }
      res.status(200).send("Product deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting product:", error);
      res.status(500).send("Internal Server Error");
    });
});
app.put("/api/updateProduct/:id", (req, res) => {
  const { name, price, description } = req.body;
  const id = parseInt(req.params.id);
  let image = req.body.image || "https://placehold.co/400";
  if (!name || !price || !description) {
    return res.status(400).send("required fields are missing");
  }
  db.query(
    "UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5 RETURNING *",
    [name, price, description, image, id]
  )
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).send("Product not found");
      }
      res.status(200).json(result.rows[0]);
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      res.status(500).send("Internal Server Error");
    });

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


