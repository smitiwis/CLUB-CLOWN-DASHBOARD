import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type params = {
  params: Promise<{ numero: string }>;
};

export async function GET(request: NextRequest, { params }: params) {
  const path = process.env.NEXT_PATH_DOC;
  const token = process.env.NEXT_TOKEN_DOC;
  const nroDni = (await params).numero;

  try {
    if (!nroDni) {
      return NextResponse.json(
        { message: { error: "Debe ingresar un número de documento" } },
        { status: 404 }
      );
    }
    const response = await axios.get(`${path}/dni/${nroDni}?token=${token}`);
    if (!response.data.success) {
      return NextResponse.json(
        { message: response.data.message },
        { status: 404 }
      );
    }
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: { error: "No se encontró el documento" } },
      { status: 404 }
    );
  }
}
