# 🧠 Task Manager - Angular Web Application

Aplicación web desarrollada en Angular 17 que permite a los usuarios gestionar sus tareas de forma sencilla e intuitiva. Esta herramienta fue creada como propuesta para una oportunidad laboral y demuestra el uso de buenas prácticas, arquitectura limpia, principios SOLID y enfoque centrado en la escalabilidad y testeo.

## 📋 Funcionalidades

- Crear tareas con título y descripción.
- Editar tareas existentes.
- Eliminar tareas.
- Marcar tareas como completadas o pendientes.
- Manejo de sesión simple con autenticación por email.
- Notificaciones mediante snackbars para acciones como eliminación y errores.
- Interfaz responsiva y moderna.

---

## 🧱 Arquitectura

La aplicación está construida siguiendo una **arquitectura limpia** y organizada en capas, promoviendo la separación de responsabilidades:

```
src/
│
├── app/
│   ├── core/                # Módulos reutilizables y esenciales del sistema
│   │   ├── guards/          # Guardas de rutas (ej. AuthGuard)
│   │   ├── header/          # Componente de encabezado reutilizable
│   │   └── interceptors/    # Interceptores HTTP (ej. manejo global de errores)
│   │
│   ├── modules/             # Módulos funcionales
│   │   ├── auth/            # Módulo de autenticación (login por email)
│   │   └── tasks/           # Módulo principal con componentes y lógica de tareas
│   │
│   ├── services/            # Servicios de dominio para interacción con API y lógica (UserService, TaskService)
│   │
│   ├── shared/              # Recursos reutilizables (pipes, directivas, componentes comunes)
│   │
│   └── app.routes.ts        # Configuración de rutas usando componentes standalone

```

- Se utilizaron componentes **standalone** (`standalone: true`) para reducir el acoplamiento entre módulos.
- Uso de `signal` y `computed` en el store para manejar estado de usuario de forma reactiva.
- Separación clara entre lógica de presentación, negocio y acceso a datos.

---

## 🛠️ Tecnologías y Herramientas

- **Angular 17** con standalone components y Angular Signals.
- **TypeScript** como lenguaje principal.
- **Angular Material** para componentes visuales (botones, inputs, snackbars).
- **Firebase Hosting** para el despliegue.
- **ESLint** para análisis estático.
- **RxJS** para manejo de flujos reactivos.
- **Jasmine / Karma** para testing.

---

## 🧪 Testing

La aplicación incluye **pruebas unitarias e integración** para garantizar el correcto funcionamiento de los casos de uso principales.

- Se implementaron pruebas para servicios como:
  - `UserService`
  - `TaskService`
  - `UserStoreService`
- Se utilizaron mocks para servicios HTTP y dependencias.
- Configuración personalizada de test con Jasmine y Karma.

---

## 🚀 Deploy

La aplicación fue desplegada en **Firebase Hosting** con la siguiente configuración:

- `firebase.json` incluye reescritura para `index.html` (SPA).
- Carpeta de build: `dist/atom-challenge-fe-template`
- Deploy manual vía `firebase deploy`

🔗 **URL de la app:** [https://atom-api-backend.web.app](https://atom-api-backend.web.app)

---

## 🧑‍💻 Cómo ejecutar localmente

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
npm install
ng serve
```

---

## 📁 Scripts importantes

```bash
ng build --configuration production   # Build para producción
ng test                               # Correr tests
firebase deploy                       # Desplegar en Firebase Hosting
```

---

## 📌 Notas finales

Este proyecto representa una propuesta profesional con foco en buenas prácticas de desarrollo web moderno. Cualquier feedback será bien recibido para seguir mejorando. 🙌

---

## 👤 Autor

**Alexandro Garcia**\
Desarrollador Web

