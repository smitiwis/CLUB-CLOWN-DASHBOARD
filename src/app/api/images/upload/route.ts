import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

// Interfaz para el resultado de la carga
interface UploadResult {
  secure_url: string;
  public_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    console.log("file ?=================", file);

    if (!file) {
      return NextResponse.json(
        { message: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Convertir el Blob a un Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir la imagen a Cloudinary
    const uploadResult: UploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "bauchers",
          transformation: [
            { format: "jpg" }, // Esta transformación convierte la imagen a JPG
            { quality: 90 },   // Para establecer la calidad de la imagen (0-100)
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadResult);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(
      { message: "Imagen subida con éxito", imageData: uploadResult },
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
