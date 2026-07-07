# SaaS - Práctica

Proyecto de práctica de un **SaaS multi-tenant** desarrollado con NestJS.

## Descripción

Este proyecto es una plataforma SaaS que permite a diferentes tipos de negocios gestionar sus operaciones diarias según su modelo de negocio.

Inicialmente se contemplan **dos tipos de suscripciones**:

- **Servicio**: Orientado a negocios que prestan servicios (consultorios, peluquerías, clínicas, etc.).
- **Comercio**: Orientado a negocios que venden productos físicos (supermercados, tiendas, etc.).

También se contempla la posibilidad de **suscripciones custom/mixtas**, como en el caso de una peluquería que necesita tanto agendar turnos (Servicio) como vender productos (Comercio) y llevar registro de clientes.

## Tecnologías

- **Backend**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Base de Datos**: PostgreSQL
- **Contenedores**: Docker (solo para la base de datos)
- **Lenguaje**: TypeScript

## Estructura inicial del proyecto

- Arquitectura modular con NestJS
- Multi-tenancy (en desarrollo)
- Gestión de suscripciones y planes
- Autenticación y autorización
- Prisma como ORM con PostgreSQL

## Cómo ejecutar el proyecto

### Requisitos

- Node.js (v18 o superior)
- Docker y Docker Compose

### Pasos

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno (copiar .env.example a .env)
   ```
   cp .env.example .env
   ```
