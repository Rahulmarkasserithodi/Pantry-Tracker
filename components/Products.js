import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Modal,
  IconButton,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const updateProducts = async () => {
    try {
      const productsCollection = collection(firestore, "products");
      const snapshot = await getDocs(productsCollection);
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error updating products:", error);
    }
  };

  useEffect(() => {
    updateProducts();
  }, []);

  const createProduct = async () => {
    try {
      const newProductRef = doc(collection(firestore, "products"), productName);
      await setDoc(newProductRef, {
        category: productCategory,
        thumbnail: thumbnailUrl,
      });
      updateProducts();
      setProductName("");
      setProductCategory("");
      setThumbnailUrl("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const addToInventory = async (product) => {
    try {
      const inventoryRef = doc(collection(firestore, "inventory"), product.id);
      const inventorySnap = await getDoc(inventoryRef);
      if (inventorySnap.exists()) {
        const { quantity } = inventorySnap.data();
        await setDoc(inventoryRef, { quantity: quantity + 1 }, { merge: true });
      } else {
        await setDoc(inventoryRef, {
          quantity: 1,
          category: product.category,
          thumbnail: product.thumbnail,
        });
      }
      console.log(`Added ${product.id} to inventory.`);
    } catch (error) {
      console.error("Error adding to inventory:", error);
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteDoc(doc(firestore, "products", id));
      updateProducts();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h5"
        color="textPrimary"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        Products
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add New Product
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          mt: 2,
        }}
      >
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            sx={{
              maxWidth: 200,
              m: 1,
              bgcolor: "#222",
              color: "text.secondary",
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={product.thumbnail}
              alt={product.id}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                textAlign="center"
              >
                {product.id}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
              >
                Category: {product.category}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => addToInventory(product)}
              >
                Add to Inventory
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => removeProduct(product.id)}
                startIcon={<DeleteIcon />}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Create New Product
          </Typography>
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          />
          <TextField
            label="Thumbnail URL"
            variant="outlined"
            fullWidth
            margin="normal"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={createProduct}
          >
            Create Product
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
