import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { message: "No se ha obtuvo el public_id", },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(body.public_id);

    // await cloudinary.uploader.destroy(body.public_id);

    return NextResponse.json(
      { message: "Imagen eliminada con éxito", },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return NextResponse.json(
      { message: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}
