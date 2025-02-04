export function formatearNombre(
  nombreCompleto: string,
  longitudMaxima: number
) {
  // Separar el nombre completo en partes
  const partes = nombreCompleto.split(" ");

  // Si hay al menos dos partes, tomar el primer nombre y el primer apellido
  if (partes.length >= 3) {
    const nombreFormateado = `${partes[0]} ${partes[1]} ${partes[2]}`;

    // Si el nombre formateado excede la longitud máxima, truncarlo
    if (nombreFormateado.length > longitudMaxima) {
      return `${nombreFormateado.slice(0, longitudMaxima)}...`;
    }

    return nombreFormateado;
  }

  // Si no hay al menos dos partes, devolver el nombre completo original
  return nombreCompleto;
}
