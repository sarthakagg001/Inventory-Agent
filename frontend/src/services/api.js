import axios from "axios";

const API_URL = "http://127.0.0.1:8001";

export const uploadFiles = async (
  inventoryFile,
  salesFile
) => {

  const formData = new FormData();

  formData.append(
    "inventory_file",
    inventoryFile
  );

  formData.append(
    "sales_file",
    salesFile
  );

  const response = await axios.post(
    `${API_URL}/upload`,
    formData
  );

  return response.data;
};