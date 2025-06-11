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





// app.get("/api/getProducts", (req, res) => {

// });

// app.post("/api/addProduct", (req, res) => {
//   const { name, price, description } = req.body;
//   let image = req.body.image || "https://placehold.co/400";
//   if (!name || !price || !description) {
//     return res.status(400).send("required fields are missing");
//   }
//   const newProduct = {
//     id: new Date().getTime(), // Unique ID based on timestamp
//     name,
//     price,
//     description,
//     image,
//   };
//   products.push(newProduct);
//   res.status(201).send("product added :", newProduct);
// });

// app.delete("/api/deleteProduct/:id", (req, res) => {
//   let id = req.params.id;

//   products = products.filter((product) => product.id !== parseInt(id));
//   res.status(200).send("Product deleted successfully");

//   // let isMatched = false;

//   // for(let i=0; i < products.length; i++){
//   //     if(products[i].id == productId){
//   //         isMatched = true;
//   //         products.splice(i , 1);
//   //         break;
//   //     }
//   // }

//   // if(isMatched){
//   //     res.send("Product Deleted");
//   // }else{
//   //     res.send(`product id (${productId}) did not matched`)
//   // }
// });
// app.put("/api/updateProduct/:id", (req, res) => {
//   const { name, price, description } = req.body;
//   const id = parseInt(req.params.id);
//   let image = req.body.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS_Db0jJvWe6vYScLksI8qoM2WCeHfJnSBVw&s";
//   if (!name || !price || !description) {
//     return res.status(400).send("required fields are missing");
//   }
//   const productIndex = products.findIndex((product) => product.id === id);
//   if (productIndex === -1) {
//     return res.status(404).send("Product not found");
//   }
//   products[productIndex] = { id, name, price, description, image };
//   res.status(200).send("Product updated successfully");
// });
