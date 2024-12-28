// import bcrypt from 'bcrypt';
import { db } from "@vercel/postgres";

const client = await db.connect();
console.log("connected to db");

async function seedLeads() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS leads (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      celular_contacto VARCHAR(9) NOT NULL CHECK (celular_contacto <> ''),
      nombre_contacto VARCHAR(255),
      color VARCHAR(10),
      status VARCHAR(20) DEFAULT 'no inscrito' CHECK (status IN ('no inscrito', 'interesado', 'inscrito')),
      edad_contacto VARCHAR(2),
      categoria_contacto VARCHAR(20) CHECK (categoria_contacto IN ('niño', 'adolescente', 'adulto') OR categoria_contacto IS NULL),
      grupo_horario VARCHAR(255),
      fecha_inicio_taller VARCHAR(10)
    );
  `;

  const leads = [
    {
      celular_contacto: "551236567",
      nombre_contacto: "ester Pérez",
      edad_contacto: "25",
      color: "verde",
      status: "interesado",
      categoria_contacto: "adulto",
      grupo_horario: "Lunes 8am",
      fecha_inicio_taller: "2024-01-15",
    },
    {
      celular_contacto: "559876443",
      nombre_contacto: "luis López",
      edad_contacto: "16",
      color: "amarillo",
      status: "inscrito",
      categoria_contacto: "adolescente",
      grupo_horario: "Miércoles 6pm",
      fecha_inicio_taller: "2024-02-01",
    },
  ];

  const insertedLeads = await Promise.all(
    leads.map(
      (lead) =>
        client.sql`
        INSERT INTO leads (nombre_contacto, celular_contacto, edad_contacto, color, status, categoria_contacto, grupo_horario, fecha_inicio_taller)
        VALUES (${lead.nombre_contacto}, ${lead.celular_contacto}, ${lead.edad_contacto}, ${lead.color}, ${lead.status} ,${lead.categoria_contacto}, ${lead.grupo_horario}, ${lead.fecha_inicio_taller})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedLeads;
}

async function seedLlamadas() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS llamadas (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
      nombre_asesor VARCHAR(255) NOT NULL,
      fecha_llamada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      detalles TEXT,
      estado VARCHAR(50) CHECK (estado IN ('respondida', '', 'no responde')),
      num_llamadas INT DEFAULT 1
    );
  `;

  const llamadas = [
    {
      lead_id: "d362c0cb-a72a-49fd-a956-f0ccfbbf6642",
      nombre_asesor: "Carlos Martínez",
      detalles: "Interesado en inscripción",
      estado: "primer contacto",
      num_llamadas: 1,
    },
    {
      lead_id: "762010b6-d1f2-4119-939c-2532733ab0a6",
      nombre_asesor: "Laura Gómez",
      detalles: "Requiere más información",
      estado: "no responde",
      num_llamadas: 2,
    },
  ];

  const insertedLlamadas = await Promise.all(
    llamadas.map(
      (llamada) =>
        client.sql`
        INSERT INTO llamadas (lead_id, nombre_asesor, detalles, color, estado, num_llamadas)
        VALUES (${llamada.lead_id}, ${llamada.nombre_asesor}, ${llamada.detalles}, ${llamada.color}, ${llamada.estado}, ${llamada.num_llamadas})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedLlamadas;
}

async function seedInscripciones() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS inscripciones (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
      fecha_inscripcion DATE NOT NULL,
      estado_inscripcion VARCHAR(50) DEFAULT 'activo',
      detalles TEXT
    );
  `;

  const inscripciones = [
    {
      lead_id: "d362c0cb-a72a-49fd-a956-f0ccfbbf6642",
      fecha_inscripcion: "2024-01-20",
      estado_inscripcion: "activo",
      detalles: "Inscripción confirmada para taller de yoga",
    },
    {
      lead_id: "762010b6-d1f2-4119-939c-2532733ab0a6",
      fecha_inscripcion: "2024-02-05",
      estado_inscripcion: "pendiente",
      detalles: "Aún no ha realizado el pago",
    },
  ];

  const insertedInscripciones = await Promise.all(
    inscripciones.map(
      (inscripcion) =>
        client.sql`
        INSERT INTO inscripciones (lead_id, fecha_inscripcion, estado_inscripcion, detalles)
        VALUES (${inscripcion.lead_id}, ${inscripcion.fecha_inscripcion}, ${inscripcion.estado_inscripcion}, ${inscripcion.detalles})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedInscripciones;
}

async function seedPagos() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS pagos (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      inscripcion_id UUID REFERENCES inscripciones(id) ON DELETE CASCADE,
      fecha_pago DATE NOT NULL,
      monto_pago DECIMAL(10, 2) NOT NULL,
      descripcion TEXT
    );
  `;

  const pagos = [
    {
      inscripcion_id: "e4212bd8-4c37-4943-a4fb-326ce95761f6",
      fecha_pago: "2024-01-25",
      monto_pago: 500.0,
      descripcion: "Primer cuota",
    },
    {
      inscripcion_id: "761295e8-8058-465e-9957-2f6038f53b8f",
      fecha_pago: "2024-02-10",
      monto_pago: 500.0,
      descripcion: "Segunda cuota",
    },
  ];

  const insertedPagos = await Promise.all(
    pagos.map(
      (pago) =>
        client.sql`
        INSERT INTO pagos (inscripcion_id, fecha_pago, monto_pago, descripcion)
        VALUES (${pago.inscripcion_id}, ${pago.fecha_pago}, ${pago.monto_pago}, ${pago.descripcion})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedPagos;
}

async function seedAsistencias() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS asistencias (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      inscripcion_id UUID REFERENCES inscripciones(id) ON DELETE CASCADE,
      fecha_asistencia DATE NOT NULL
    );
  `;

  const asistencias = [
    {
      inscripcion_id: "e4212bd8-4c37-4943-a4fb-326ce95761f6",
      fecha_asistencia: "2024-01-30",
    },
    {
      inscripcion_id: "e4212bd8-4c37-4943-a4fb-326ce95761f6",
      fecha_asistencia: "2024-02-06",
    },
  ];

  const insertedAsistencias = await Promise.all(
    asistencias.map(
      (asistencia) =>
        client.sql`
        INSERT INTO asistencias (inscripcion_id, fecha_asistencia)
        VALUES (${asistencia.inscripcion_id}, ${asistencia.fecha_asistencia})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedAsistencias;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    // await client.sql`DROP TABLE IF EXISTS asistencias, pagos, inscripciones, llamadas, leads`;
    await seedLeads();
    // await seedLlamadas();
    // await seedInscripciones();
    // await seedPagos();
    // await seedAsistencias();
    await client.sql`COMMIT`;

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
