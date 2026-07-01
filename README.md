# 🏋️ Sistema de Gestión de Gimnasio

Sistema completo para la gestión de socios, planes y membresías de un gimnasio.  
Incluye backend con Supabase y frontend en React con validaciones por pasos.

---

## 📌 ¿De qué trata el proyecto?

Este proyecto es un sistema de administración para gimnasios que permite:

- Registrar socios con datos personales completos
- Gestionar contactos de emergencia
- Asignar planes de suscripción
- Crear membresías activas por socio
- Validar datos en tiempo real durante la carga
- Evitar duplicados (ej: DNI repetido)

El flujo de alta de socio se divide en **3 pasos guiados**, lo que mejora la experiencia del usuario y reduce errores.

---

## 🧱 Arquitectura del sistema

El proyecto está dividido en dos capas principales:

### 🔹 Frontend (React)
- Componentes reutilizables (`SocioFields`, `ContactoFields`, `PlanSelector`)
- Formularios multi-step
- Validaciones en tiempo real
- Manejo de estado con `useState` y `useEffect`

### 🔹 Backend (Supabase)
- Base de datos PostgreSQL
- API automática REST
- Manejo de relaciones entre tablas
- Validaciones a nivel aplicación (no DB constraints complejos en MVP)

---

## 🛠️ Tecnologías utilizadas

- React (Vite)
- JavaScript (ES6+)
- Supabase (PostgreSQL + API REST)
- HTML + CSS modular
- Git / GitHub

---

## 🧩 Modelo de datos

### 🧍 Socio
- id_socio (PK)
- apellido
- nombre
- dni
- fecha_nacimiento
- localidad
- codigo_postal
- calle
- numero
- telefono
- email

---

### 🚨 Contacto de emergencia
- id_contacto (PK)
- id_socio (FK)
- nombre
- telefono
- relacion

---

### 🏋️ Plan
- id_plan (PK)
- nombre
- descripcion
- precio

Planes:
- Básico
- Standard
- Premium

---

### 📄 Membresía
- id_membresia (PK)
- id_socio (FK)
- id_plan (FK)
- estado (activo / vencido)
- observaciones
- fecha_alta
- fecha_de_baja *(a futuro)*

---

## 🔗 Relaciones

- Socio → Contacto (1:1)
- Socio → Membresía (1:N conceptual)
- Plan → Membresía (1:N)

---

## 🧠 Decisiones técnicas

- Formulario dividido en 3 pasos para mejor UX
- Validaciones separadas por etapa (`validateStep1`, `validateStep2`, `validateStep3`)
- Validación de DNI duplicado contra Supabase
- Manejo de errores en tiempo real
- Componentes reutilizables para escalabilidad
- Separación clara entre UI y lógica de validación

---

## 🤖 Uso de Inteligencia Artificial

Se utilizó IA (ChatGPT) para:

- Diseñar la arquitectura del formulario multi-step
- Optimizar la lógica de validación por etapas
- Corregir errores de integración con Supabase
- Mejorar la estructura de componentes React
- Depurar problemas de estado (`setErrores`, validaciones y flujos async)
- Proponer mejores prácticas de UX en formularios largos

La IA funcionó como asistente de desarrollo para acelerar iteraciones y debugging de manera exitosa.

---

## ⚙️ Cómo instalar y correr el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/Damm1990/PowerGymSJ.git
cd gym-system