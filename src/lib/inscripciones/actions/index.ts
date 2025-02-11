"use server";

import { getUserId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  IF_InscripcionReq,
  IStateInscription,
} from "@/app/dashboard/inscripciones/resources/schemas";
import cloudinary from "@/lib/cloudinary";
import { IUploadResult } from "@/app/dashboard/inscripciones/resources/definitions";

export async function crearInscripcion(
  prevState: IStateInscription,
  formData: IF_InscripcionReq
) {
  let uploadResult: IUploadResult | null = null;

  try {
    // Validate form using Zod

    // VALIDAR SI EXISTE EL USERID
    const userId = await getUserId();
    if (!userId) return null;

    const estadoPago = formData.pago ? formData.pago.estado : "sin_pago";

    // validar que el cliente no este inscrito en el taller
    const inscrito = await prisma.taller_cliente.findFirst({
      where: {
        id_cliente: formData.id_cliente,
        id_taller: formData.id_taller,
      },
    });

    if (inscrito) {
      throw {
        message: "El cliente ya se encuentra inscrito en este taller",
        status: 400,
        field: "id_cliente",
      };
    }

    // Crear la inscripcion
    const inscripcion = await prisma.taller_cliente.create({
      data: {
        id_cliente: formData.id_cliente,
        id_taller: formData.id_taller,
        id_taller_promocion: formData.id_taller_promocion,
        id_usuario: userId,
        estado_pago: estadoPago,
        precio_venta: parseFloat(formData.precio_venta),
        observacion: formData.observacion,
      },
    });

    if (inscripcion) {
      // actualizar estado del cliente
      await prisma.cliente.update({
        where: { id_cliente: formData.id_cliente },
        data: {
          estado:
            formData.pago && parseInt(formData.pago.monto) > 25 ? "6" : "7", // cambiamos el color de estado del cliente
        },
      });

      if (formData.pago) {
        // Crear el pago 1er pago
        const { monto, metodo_pago, baucher, nro_transaccion } = formData.pago;
        const file = baucher.get("file") as Blob;

        if (!file) {
          throw {
            message: "No se proporcionó ningún archivo",
            status: 400,
            field: "baucher",
          };
        }

        // Convertir el Blob a un Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Subir la imagen a Cloudinary
        uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "bauchers",
              transformation: [
                { format: "jpg" }, // Esta transformación convierte la imagen a JPG
                { quality: 90 }, // Para establecer la calidad de la imagen (0-100)
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as IUploadResult);
              }
            }
          );
          uploadStream.end(buffer);
        });

        if (uploadResult) {
          const urlImage = uploadResult.url;
          const uploadIndex = urlImage.indexOf("upload") + "upload".length;
          const imagePath = urlImage.slice(uploadIndex);

          await prisma.taller_cliente_pagos.create({
            data: {
              id_taller_cliente: inscripcion.id_taller_cliente,
              monto: parseFloat(monto),
              metodo_pago: metodo_pago,
              img_boucher: imagePath,
              nro_transaccion: nro_transaccion,
              fecha_pago: new Date(),
            },
          });
        }
      }
    }
  } catch (error) {
    if (uploadResult) {
      await cloudinary.uploader.destroy(uploadResult.public_id);
    }

    if (error instanceof Error) {
      return { message: error.message };
    } else if (typeof error === "object") {
      return error;
    } else {
      return { message: "Error desconocido" };
    }
  }

  // Revalidate the cache for the invoices Page and redirect the user.
  revalidatePath("/dashboard/inscripciones");
  redirect("/dashboard/inscripciones");
}
