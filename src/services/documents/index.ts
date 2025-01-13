import axios from "axios";

export const getDataByDni = async (nroDni: string) => {
  const path = process.env.NEXT_PATH_DOC;
  const token = process.env.NEXT_TOKEN_DOC;
  
  try {
    const apiURL = `${path}/dni/${nroDni}?token=${token}`;
    const response = await axios.get(apiURL);
    if (!response.data.success) {
      const message = response.data.message;
      return { message };
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      message: {
        error: "No se encontró el documento",
      },
    };
  }
};
