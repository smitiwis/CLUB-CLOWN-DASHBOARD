import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      message: "Usuarios iniciales insertados exitosamente.",
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error)
    // Usar 'unknown' en lugar de 'any'
    // Verificar si el error tiene la propiedad 'message'
    if (error instanceof Error) {
      console.error("Error al insertar:", error.message);
      // Responder con un mensaje de error
      return NextResponse.json(
        { message: "Error al insertar", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Error desconocido:", error);
      return NextResponse.json(
        {
          message: "Error desconocido",
          error: "No se pudo identificar el error.",
        },
        { status: 500 }
      );
    }
  }
}
