import { ZonedDateTime } from "@internationalized/date";

// Función para convertir ZonedDateTime a Date compatible con Prisma
export function convertToPrismaDate(date: ZonedDateTime): Date {
  const { year, month, day, hour, minute, second, millisecond } = date;

  // Asegurémonos de que la fecha esté en UTC y almacenémosla en formato correcto
  const utcDate = new Date(
    Date.UTC(year, month - 1, day, hour + 5, minute, second, millisecond)
  );


  return utcDate; // Devolvemos la fecha en UTC
}
