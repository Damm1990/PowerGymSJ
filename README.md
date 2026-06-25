# Sistema de Gestión de Gimnasio

## 📌 Día 1 - Diseño de Base de Datos y Modelado (Supabase)

Este proyecto corresponde a un challenge técnico de desarrollo web.  
En esta primera etapa se realizó el diseño completo de la base de datos utilizando Supabase, definiendo entidades, relaciones y carga inicial de datos.

---

## 🧱 Descripción del Proyecto

El sistema permite gestionar socios de un gimnasio, sus planes de suscripción, membresías y contactos de emergencia.

El objetivo es construir una base sólida y escalable que luego será integrada con un frontend en React.

---

## 🛠️ Tecnologías utilizadas

- Supabase (PostgreSQL)
- SQL / Importación de CSV
- Diseño de bases de datos relacionales

---

## 🧩 Modelo de Base de Datos

### 🧍 Socio
Representa a los miembros del gimnasio.

**Campos:**
- id_socio (PK)
- apellido
- nombre
- dni
- fecha_nacimiento
- localidad
- cp
- calle
- numero
- telefono
- email

---

### 🚨 Contacto de Emergencia
Representa el contacto de emergencia de cada socio (relación 1:1).

**Campos:**
- id_contacto (PK)
- id_socio (FK → socio.id_socio)
- nombre
- telefono
- relacion

---

### 🏋️ Plan
Define los planes de suscripción del gimnasio.

**Campos:**
- id_plan (PK)
- nombre
- descripcion
- precio (numeric)

**Planes creados:**
- BÁSICO (25.000)
- STANDARD (30.000)
- PREMIUM (80.000)

---

### 📄 Membresía
Entidad central que vincula socios con planes.

**Campos:**
- id_membresia (PK)
- id_socio (FK → socio.id_socio)
- id_plan (FK → plan.id_plan)
- estado (activo / vencido)
- observaciones
- fecha_alta (date)
- fecha_vencimiento (date)

---

## 🔗 Relaciones

- Socio → Contacto de Emergencia (1:1)
- Socio → Membresía (conceptualmente 1:N, actualmente 1 activa por socio)
- Plan → Membresía (1:N)

---

## 📊 Carga de datos inicial

Se cargaron datos de prueba mediante archivos CSV:

- 10 socios con datos realistas (La Matanza, Argentina)
- 10 contactos de emergencia vinculados
- 10 membresías con estado activo y vencido

- 3 planes de gimnasio (cargados manualmente por ser breves)

---

## 🧠 Decisiones de diseño

- Uso de `text` en lugar de enums para mayor flexibilidad
- Uso de `numeric` para precios evitando errores de precisión
- Fechas almacenadas como `date` (no se requiere hora)
- Modelo simplificado para MVP sin complejidad innecesaria
- Estructura preparada para integración con React

---

## 📊 Diagrama de Base de Datos

El diseño de la base de datos se encuentra en la carpeta `/docs/database`.

Incluye todas las entidades, relaciones y claves del sistema.

---

## ⚙️ Configuración en Supabase

- Creación de tablas mediante Table Editor
- Definición de claves primarias
- Configuración de claves foráneas (FK)
- Importación masiva de datos mediante CSV

---

## 🚀 Próximos pasos

- Integración con frontend en React
- Implementación de login de usuarios
- Pantallas de gestión de socios
- Visualización de membresías y planes

---

## 📅 Estado del proyecto

✔ Diseño de base de datos completado  
✔ Relaciones definidas  
✔ Datos iniciales cargados  
⏳ Desarrollo del frontend pendiente