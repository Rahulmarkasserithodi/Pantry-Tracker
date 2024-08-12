import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Modal,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
require("dotenv").config();
import { OpenAI } from "openai"; // Correct import for new versions

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [open, setOpen] = useState(false);

  const updateInventory = async () => {
    try {
      const inventoryCollection = collection(firestore, "inventory");
      const snapshot = await getDocs(inventoryCollection);
      const inventoryList = snapshot.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, "inventory"), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const generateRecipes = async () => {
    setLoading(true);
    try {
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });

      const ingredientList = inventory.map((item) => item.name).join(", ");
      console.log("Generating recipe with ingredients:", ingredientList); // Log ingredients

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a chef that provides recipe suggestions.",
          },
          {
            role: "user",
            content: `Create a recipe using these ingredients: ${ingredientList}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      console.log("OpenAI API response:", response); // Log API response

      const generatedText = response.choices[0].message.content.trim();
      setRecipes(generatedText.split("\n\n")); // Split recipes by paragraphs
      setOpen(true); // Open modal to show recipes
    } catch (error) {
      console.error("Error generating recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        color="textPrimary"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        Inventory Items
      </Typography>
      {inventory.length === 0 ? (
        <Typography variant="body1" color="textSecondary" textAlign="center">
          Inventory is Empty, Add Items
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            width: "100%",
            maxWidth: 800,
          }}
        >
          {inventory.map(({ name, quantity, category, thumbnail }) => (
            <Card
              key={name}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#222",
                color: "text.secondary",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              {thumbnail && (
                <CardMedia
                  component="img"
                  sx={{ width: 100, paddingLeft: 1 }} // Added padding here
                  image={thumbnail}
                  alt={name}
                />
              )}
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography gutterBottom variant="h6" component="div">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Quantity: {quantity}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Category: {category || "None"}
                </Typography>
              </CardContent>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => removeItem(name)}
                sx={{ margin: 1 }}
              >
                Remove
              </Button>
            </Card>
          ))}
        </Box>
      )}
      {inventory.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={generateRecipes}
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Recipe"}
        </Button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Recipe Suggestions
          </Typography>
          <Box sx={{ mt: 2 }}>
            {recipes.map((recipe, index) => (
              <Typography
                key={index}
                variant="body1"
                color="textPrimary"
                sx={{ mb: 2 }}
              >
                {recipe}
              </Typography>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
