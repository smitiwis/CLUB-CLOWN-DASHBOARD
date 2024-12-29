CREACION DE TABLAS
 npx prisma migrate dev --name init

1. Asegúrate de tener las dependencias necesarias
Primero, asegúrate de que tienes las dependencias necesarias instaladas. Si no las has instalado, ejecuta:
npm install @prisma/client
npm install prisma --save-dev

2. Verifica tu archivo schema.prisma
Asegúrate de que tu archivo schema.prisma esté configurado correctamente. Por ejemplo:
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // o "mysql", dependiendo de tu base de datos
  url      = env("DATABASE_URL")
}

model Usuario {
  id   String   @id @default(cuid())
  nombre       String
  telefono     String
  dni          String
  fecha_ingreso String
  estado       String
  correo       String   @unique
  password     String
  fecha_creacion DateTime @default(now())
}

 3. Genera el cliente Prisma
Si aún no has generado el cliente Prisma, ejecuta:

npx prisma generate
Este comando generará el cliente Prisma que puedes usar en tu código.