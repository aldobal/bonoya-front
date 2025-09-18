# 💰 BonoYa - Sistema de Gestión de Bonos Corporativos

> **Sistema web profesional para la gestión integral de bonos corporativos con cálculos financieros avanzados**

BonoFácil es una plataforma web desarrollada con **Angular 20** que permite a emisores e inversores gestionar bonos corporativos con cálculos financieros precisos utilizando el método americano. El proyecto implementa **Domain-Driven Design (DDD)** y **Arquitectura Hexagonal** para garantizar escalabilidad, mantenibilidad y robustez.

---

## 🎯 **¿Qué Problema Soluciona?**

### **Para Emisores de Bonos:**
- ✅ **Gestión centralizada** de carteras de bonos
- ✅ **Cálculos automáticos** de TCEA (Tasa de Coste Efectivo Anual)
- ✅ **Flujos de caja detallados** con plazos de gracia
- ✅ **Análisis de costes** de emisión en tiempo real

### **Para Inversores:**
- ✅ **Catálogo completo** de bonos disponibles
- ✅ **Análisis de rendimiento** con TREA (Tasa de Rendimiento Efectivo Anual)
- ✅ **Simulaciones de inversión** con diferentes escenarios
- ✅ **Comparativas** de rentabilidad entre bonos

### **Para el Mercado Financiero:**
- ✅ **Transparencia** en la valoración de bonos
- ✅ **Estandarización** de cálculos financieros
- ✅ **Acceso democrático** a herramientas profesionales

---

## 🏗️ **Arquitectura y Tecnologías**

### **Stack Tecnológico**

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------|
| **Frontend** | Angular | 20.0.0 | Framework principal |
| **Testing** | Jasmine + Karma | 5.7.0 | Pruebas unitarias |
| **Build Tool** | Angular CLI | 20.0.3 | Tooling y build |
| **Language** | TypeScript | 5.8.2 | Lenguaje principal |
| **Styling** | CSS3 + Glassmorphism | - | Diseño moderno |
| **HTTP Client** | Angular HTTP | - | Comunicación API |
| **State Management** | RxJS | 7.8.0 | Programación reactiva |

### **Arquitectura Domain-Driven Design (DDD)**

```
src/app/
├── core/                     # 🏛️ Núcleo de la aplicación
│   ├── domain/              # 📋 Lógica de negocio central
│   │   ├── models/          # 📊 Modelos de dominio
│   │   └── ports/           # 🔌 Interfaces (puertos)
│   ├── application/         # ⚙️ Casos de uso
│   │   └── services/        # 🛠️ Servicios de aplicación
│   └── infrastructure/      # 🔧 Implementaciones técnicas
│       ├── adapters/        # 🔗 Adaptadores externos
│       ├── guards/          # 🛡️ Guards de Angular
│       ├── interceptors/    # 🔄 Interceptores HTTP
│       └── providers/       # 💉 Proveedores DI
│
├── shared/                  # 🤝 Componentes compartidos
│   ├── components/          # 🧩 UI reutilizable
│   └── services/            # 🔧 Servicios transversales
│
├── iam/                     # 🔐 Identity & Access Management
│   ├── domain/             # 👤 Dominio de autenticación
│   ├── application/        # 🔑 Lógica de autenticación
│   ├── infrastructure/     # 🔒 Adaptadores de auth
│   └── views/              # 🖼️ Componentes de UI
│
├── bonos/                   # 💰 Gestión de bonos (Core Domain)
│   ├── domain/             # 📈 Modelos de negocio financiero
│   ├── application/        # 🧮 Cálculos financieros
│   ├── infrastructure/     # 🌐 Adaptadores API
│   └── views/              # 📱 Componentes específicos
│
├── emisor/                  # 🏢 Módulo del emisor
│   └── views/              # 📊 Dashboard y gestión
│
└── inversor/               # 💼 Módulo del inversor
    └── views/              # 📈 Catálogo y análisis
```

### **Principios de Clean Architecture Implementados**

1. **🎯 Separación de Responsabilidades**: Cada capa tiene una responsabilidad única
2. **🔄 Inversión de Dependencias**: Las capas internas no dependen de las externas
3. **🧩 Modularidad**: Código organizado en bounded contexts independientes
4. **🔌 Puertos y Adaptadores**: Abstracciones para comunicación externa
5. **💉 Inyección de Dependencias**: Bajo acoplamiento entre componentes

---

## ✨ **Características Principales**

### **🔐 Sistema de Autenticación**
- **JWT Token-based** con expiración automática
- **Roles diferenciados**: Emisor vs Inversor
- **Guards inteligentes** para protección de rutas
- **Interceptores HTTP** para inyección automática de tokens

### **💰 Gestión de Bonos (Emisor)**
- **CRUD completo** de bonos corporativos
- **Cálculo automático** de flujos de caja
- **Soporte para plazos de gracia** (parciales y totales)
- **Métricas financieras**: TCEA, duración, convexidad
- **Dashboard** con estadísticas en tiempo real

### **📊 Análisis de Inversiones (Inversor)**
- **Catálogo dinámico** con filtros avanzados
- **Simulador de inversiones** con TREA
- **Análisis comparativo** entre bonos
- **Cálculo de precios** de mercado
- **Guardado de análisis** para revisión posterior

### **🧮 Motor de Cálculos Financieros**
- **Método Americano** exclusivamente
- **Flujos de caja detallados** período por período
- **Duración y Convexidad** para análisis de riesgo
- **TCEA/TREA** con precisión decimal
- **Precio de mercado** con diferentes tasas de descuento

---

## 🎨 **Diseño UX/UI Moderno**

### **🌟 Glassmorphism Design System**
- **Fondos semitransparentes** con efectos blur
- **Gradientes sofisticados** en botones y elementos
- **Animaciones fluidas** y transiciones suaves
- **Responsive design** optimizado para todos los dispositivos

### **🎨 Diferenciación Visual por Roles**
- **Emisor (Azul)**: `#3b82f6` → `#1d4ed8` - Tema corporativo profesional
- **Inversor (Verde)**: `#059669` → `#047857` - Tema orientado a crecimiento

### **🧩 Componentes Modernos**
- **Cards interactivas** con efectos hover
- **Formularios inteligentes** con validación en tiempo real
- **Tablas responsivas** con filtros dinámicos
- **Dashboards** con métricas visuales

---

## 🧪 **Testing y Calidad de Código**

### **🔬 Estrategia de Testing**
```bash
# Pruebas unitarias con Jasmine + Karma
npm run test

# Coverage reports
ng test --code-coverage

# E2E testing (configurado)
ng e2e
```

### **📏 Buenas Prácticas Implementadas**

#### **🏗️ Clean Code**
- **Nombres descriptivos** en variables y funciones
- **Funciones pequeñas** con responsabilidad única
- **Comentarios significativos** en lógica compleja
- **Separación clara** entre lógica de negocio y presentación

#### **🎯 SOLID Principles**
- **Single Responsibility**: Cada clase tiene una sola razón para cambiar
- **Open/Closed**: Abierto para extensión, cerrado para modificación
- **Liskov Substitution**: Interfaces coherentes y sustituibles
- **Interface Segregation**: Interfaces específicas por funcionalidad
- **Dependency Inversion**: Dependencias hacia abstracciones

#### **🔄 Principios DDD**
- **Bounded Contexts** claramente definidos
- **Ubiquitous Language** en modelos de dominio
- **Value Objects** inmutables para conceptos financieros
- **Aggregate Roots** para consistencia transaccional
- **Domain Services** para lógica de negocio compleja

---

## 🚀 **Instalación y Configuración**

### **📋 Requisitos Previos**
- **Node.js** v20.19.0 o superior
- **Angular CLI** v20.0.3
- **Git** para control de versiones
- **Backend API** ejecutándose en `http://localhost:8080`

### **⚡ Instalación Rápida**

```bash
# 1. Clonar el repositorio
git clone https://github.com/CodAress/bonoya-frontend.git
cd bonoya-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Verificar src/environments/environment.ts

# 4. Ejecutar en desarrollo
npm start
# Acceso: http://localhost:4200
```

### **🐳 Deployment con Docker**

```bash
# Desarrollo con Docker
npm run docker:dev

# Producción optimizada
npm run docker:prod

# Scripts disponibles
npm run docker:clean    # Limpiar contenedores
npm run docker:logs     # Ver logs
npm run docker:shell    # Acceder al contenedor
```

---

## 🏃‍♂️ **Comandos de Desarrollo**

| Comando | Propósito | Puerto |
|---------|-----------|--------|
| `npm start` | Desarrollo local | 4200 |
| `npm run build` | Build de desarrollo | - |
| `npm run build:prod` | Build optimizado | - |
| `npm test` | Pruebas unitarias | - |
| `npm run docker:dev` | Docker desarrollo | 4200 |
| `npm run docker:prod` | Docker producción | 80 |

---

## 🔐 **Flujo de Autenticación y Autorización**

### **🚀 Proceso de Login**
1. **Usuario accede** a `/login`
2. **Credenciales validadas** contra API backend
3. **JWT token recibido** y almacenado localmente
4. **Redirección inteligente** según rol:
   - 🏢 **Emisor** → `/emisor/dashboard`
   - 💼 **Inversor** → `/inversor/dashboard`

### **🛡️ Protección de Rutas**
- **AuthGuard**: Verifica autenticación general
- **EmisorGuard**: Valida permisos de emisor
- **InversorGuard**: Valida permisos de inversor
- **JWT Interceptor**: Inyecta automáticamente tokens

---

## 🌐 **Integración con Backend**

### **🔗 Arquitectura de Comunicación**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND ANGULAR                        │
├─────────────────────────────────────────────────────────────┤
│  📱 COMPONENTES                                            │
│  ├── CatalogoBonosComponent ──┐                           │
│  ├── CalcularFlujoComponent ──┼── usa ──► BonoService      │
│  ├── MisCalculosComponent ────┤                           │
│  └── DashboardComponent ──────┤                           │
├─────────────────────────────────────────────────────────────┤
│  🔧 SERVICIOS (Hexagonal)                                  │
│  ├── BonoService                                          │
│  │   └── BonoApiAdapter ──────────────┐                   │
│  ├── AuthService                      │                   │
│  │   └── AuthApiAdapter ──────────────┼── HTTP ──►        │
│  └── CalculoService                   │                   │
│      └── CalculoApiAdapter ────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  🔌 INFRAESTRUCTURA                                        │
│  ├── JWT Interceptor                                      │
│  ├── Error Handler                                        │
│  └── Logging Service                                      │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND SPRING BOOT                    │
│  API REST (Puerto 8080)                                   │
└─────────────────────────────────────────────────────────────┘
```

### **📡 Endpoints Principales**

| Módulo | Endpoint | Método | Descripción |
|--------|----------|--------|-------------|
| **Auth** | `/api/v1/auth/login` | POST | Autenticación |
| **Auth** | `/api/v1/auth/register` | POST | Registro |
| **Emisor** | `/api/v1/emisor/bonos` | GET | Mis bonos |
| **Emisor** | `/api/v1/emisor/bonos/{id}/flujo` | GET | Flujo de caja |
| **Inversor** | `/api/v1/inversor/bonos/catalogo` | GET | Catálogo |
| **Cálculos** | `/api/v1/calculos/trea` | POST | TREA |

---

## 📊 **Módulos y Funcionalidades**

### **🏢 Módulo Emisor**
- **📊 Dashboard**: Métricas de bonos emitidos
- **➕ Crear Bono**: Formulario inteligente con validaciones
- **📝 Editar Bono**: Modificación de parámetros
- **🗑️ Eliminar Bono**: Gestión segura de eliminación
- **💰 Flujo de Caja**: Visualización detallada período por período
- **📈 Cálculo TCEA**: Análisis de costes de emisión

### **💼 Módulo Inversor**
- **🏠 Dashboard**: Vista general de oportunidades
- **📚 Catálogo**: Bonos disponibles con filtros avanzados
- **🔍 Detalle Bono**: Información completa del bono
- **🧮 Simulador**: Cálculos de TREA e inversión
- **💾 Mis Análisis**: Guardado de simulaciones
- **📊 Comparativa**: Análisis entre múltiples bonos

### **🔐 Módulo IAM**
- **🚪 Login/Registro**: Autenticación segura
- **👤 Gestión de Perfil**: Actualización de datos
- **🔑 Cambio de Contraseña**: Seguridad de cuenta
- **📱 Sesiones**: Gestión de tokens JWT

---

## 🐳 **Containerización y DevOps**

### **🏗️ Arquitectura Docker**

#### **Desarrollo**
```dockerfile
FROM node:20.19.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
```

#### **Producción (Multi-stage)**
```dockerfile
# Stage 1: Build
FROM node:20.19.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

# Stage 2: Production
FROM nginx:1.25.4-alpine
COPY --from=builder /app/dist/untitled/browser /usr/share/nginx/html
COPY docker/nginx-simple.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **🚀 CI/CD Pipeline (Jenkins)**
1. **📥 Checkout**: Descarga código fuente
2. **🏗️ Build**: Construcción de imagen Docker
3. **📤 Push**: Subida a Docker Registry
4. **🚀 Deploy**: Despliegue en servidor de producción
5. **✅ Health Check**: Verificación de estado

---

## 🔧 **Configuración de Entornos**

### **🌍 Variables de Entorno**

#### **Desarrollo** (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  appVersion: '1.0.0',
  logLevel: 'debug',
  features: {
    enableLogging: true,
    enableDebugMode: true
  }
};
```

#### **Producción** (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://52.176.215.11:8080',
  appVersion: '1.0.0',
  logLevel: 'error',
  features: {
    enableLogging: false,
    enableDebugMode: false
  }
};
```

#### **Docker** (`environment.docker.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://host.docker.internal:8080',
  appVersion: '1.0.0-docker',
  logLevel: 'debug'
};
```

---

## 🧪 **Testing y Calidad**

### **📋 Estrategia de Testing**

#### **Unit Testing**
```bash
# Ejecutar todas las pruebas
ng test

# Ejecutar con coverage
ng test --code-coverage

# Ejecutar en modo watch
ng test --watch

# Ejecutar específico
ng test --include="**/bono.service.spec.ts"
```

#### **E2E Testing**
```bash
# Configuración E2E
ng e2e

# Testing específico
ng e2e --spec=login.e2e-spec.ts
```

### **📊 Métricas de Calidad**
- **Cobertura de Código**: >80% objetivo
- **Complejidad Ciclomática**: <10 por función
- **Code Smells**: 0 tolerancia
- **Vulnerabilidades**: Auditoría automática con `npm audit`

---

## 🤝 **Contribución y Desarrollo**

### **📝 Guías de Contribución**

#### **🎯 Estándares de Código**
1. **TypeScript Strict Mode** activado
2. **ESLint + Prettier** para formateo automático
3. **Conventional Commits** para mensajes de commit
4. **Naming Conventions**:
   - PascalCase para clases e interfaces
   - camelCase para métodos y propiedades
   - kebab-case para archivos y componentes

#### **🔄 Workflow de Desarrollo**
```bash
# 1. Crear rama feature
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar con TDD
ng generate component mi-componente
ng test mi-componente

# 3. Commit con conventional commits
git commit -m "feat(bonos): add nuevo cálculo financiero"

# 4. Push y PR
git push origin feature/nueva-funcionalidad
```

#### **🧪 Testing Guidelines**
- **Unit tests obligatorios** para servicios
- **Integration tests** para componentes complejos
- **Mock data** para pruebas aisladas
- **Coverage mínimo 80%** para nueva funcionalidad

---

## 📈 **Roadmap y Futuras Mejoras**

### **🎯 Próximas Funcionalidades**
- [ ] **📊 Dashboard Analytics** con gráficos interactivos
- [ ] **🔄 Real-time Updates** con WebSockets
- [ ] **📱 PWA Support** para uso offline
- [ ] **🌐 Internacionalización** (i18n) multi-idioma
- [ ] **📈 Reportes PDF** exportables
- [ ] **🤖 AI-powered** recomendaciones de inversión

### **🔧 Mejoras Técnicas**
- [ ] **🔄 NgRx** para gestión avanzada de estado
- [ ] **📦 Micro-frontends** con Module Federation
- [ ] **🚀 Server-Side Rendering** (SSR)
- [ ] **⚡ Performance** optimizations con OnPush
- [ ] **🛠️ Automated Testing** con Cypress

---

## 📚 **Documentación Adicional**

### **📋 Recursos del Proyecto**
- **🐳 [Guía Docker](./DOCKER.md)**: Configuración completa de contenedores
- **🔗 [Integración Backend](./INTEGRACION_BACKEND.md)**: APIs y comunicación
- **🎨 [Rediseño UI](./REDISEÑO_COMPLETO_RESUMEN.md)**: Sistema de diseño moderno
- **🔧 [Configuración Jenkins](./Jenkinsfile)**: Pipeline CI/CD

### **🌐 URLs del Proyecto**
| Entorno | URL | Puerto | Estado |
|---------|-----|--------|--------|
| **Desarrollo** | http://localhost:4200 | 4200 | ✅ Activo |
| **Producción** | http://52.176.215.11 | 80 | ✅ Activo |
| **Docker Dev** | http://localhost:4200 | 4200 | ✅ Disponible |
| **Docker Prod** | http://localhost | 80 | ✅ Disponible |

---

## 🏆 **Características Destacadas**

### **💎 Valor Diferencial**
- **🏗️ Arquitectura Profesional**: DDD + Hexagonal + Clean Code
- **🎨 UX/UI Moderno**: Glassmorphism + Responsive Design
- **⚡ Performance**: Angular 20 + OnPush Strategy
- **🔒 Seguridad**: JWT + Guards + Interceptors
- **🐳 DevOps Ready**: Docker + CI/CD + Monitoring
- **🧪 Testing Completo**: Unit + Integration + E2E

### **📊 Métricas del Proyecto**
- **📁 Archivos**: 200+ archivos TypeScript
- **📋 Componentes**: 50+ componentes reutilizables
- **🔧 Servicios**: 20+ servicios especializados
- **🛡️ Guards**: 3 guards de seguridad
- **🔄 Interceptors**: 2 interceptors HTTP
- **🧪 Tests**: 95% coverage objetivo

---

## 📞 **Soporte y Contacto**

### **🎯 Equipo de Desarrollo**
- **👨‍💻 Lead Developer**: CodAress
- **📧 Email**: [contacto@ejemplo.com]
- **🌐 Repository**: https://github.com/CodAress/bonoya-frontend

### **🆘 Resolución de Problemas**
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versiones
node --version  # Debe ser v20+
ng version      # Debe ser v20+

# Logs de debugging
npm run docker:logs
ng serve --verbose
```

---

## 📄 **Licencia**

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](./LICENSE) para más detalles.

---

<div align="center">
  
**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub ⭐**

---

**Desarrollado con ❤️ por CodAress**

*Última actualización: Septiembre 2025*

</div>
