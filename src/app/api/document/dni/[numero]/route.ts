import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const numeroDocument = req.url.split("/").pop();

  const path = process.env.NEXT_PATH_DOC;
  const token = process.env.NEXT_TOKEN_DOC;
  try {
    const response = await axios.get(
      `${path}/dni/${numeroDocument}?token=${token}`
    );
    if (!response.data.success) {
      return NextResponse.json(
        {
          message: response.data.message,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: {
          error: "No se encontró el documento",
        },
      },
      { status: 404 }
    );
  }
}
