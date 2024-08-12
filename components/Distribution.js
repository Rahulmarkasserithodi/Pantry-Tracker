import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { firestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

// Register the Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

export default function Distribution() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryCollection = collection(firestore, "inventory");
        const snapshot = await getDocs(inventoryCollection);
        const inventoryList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventory(inventoryList);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);

  const pieData = {
    labels: inventory.map((item) => item.id),
    datasets: [
      {
        data: inventory.map((item) => item.quantity),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
          "#FF6384",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
          "#FF6384",
        ],
      },
    ],
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" color="textPrimary" textAlign="center">
        Inventory Distribution
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Pie data={pieData} />
      </Box>
    </Box>
  );
}
