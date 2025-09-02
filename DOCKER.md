# 🐳 BonoFácil - Configuración Docker

## 📋 Estructura de Archivos Docker

```
f:\Finanzas\2025\Fronted\
├── Dockerfile                  # Producción (multi-stage)
├── Dockerfile.dev             # Desarrollo
├── docker-compose.yml         # Desarrollo
├── docker-compose.prod.yml    # Producción
├── .dockerignore             # Archivos ignorados
├── docker-utils.sh           # Script de utilidades
└── docker/
    ├── nginx.conf            # Configuración Nginx
    └── init-db.sql          # Script inicialización DB
```

## 🚀 Comandos Rápidos

### **Desarrollo**
```bash
# Iniciar aplicación (puerto 4200)
npm run docker:dev

# En segundo plano
npm run docker:dev:detached

# Ver logs
npm run docker:logs

# Entrar al contenedor
npm run docker:shell

# Detener
npm run docker:stop
```

### **Producción**
```bash
# Iniciar aplicación (puerto 80)
npm run docker:prod

# En segundo plano
npm run docker:prod:detached

# Detener
npm run docker:stop:prod
```

### **Utilidades**
```bash
# Limpiar todo
npm run docker:clean

# Solo construir imagen
npm run docker:build
```

## 🔧 Script de Utilidades

```bash
# Hacer ejecutable (solo en Linux/Mac)
chmod +x docker-utils.sh

# Usar script
./docker-utils.sh dev      # Iniciar desarrollo
./docker-utils.sh prod     # Iniciar producción
./docker-utils.sh logs     # Ver logs
./docker-utils.sh shell    # Entrar al contenedor
./docker-utils.sh clean    # Limpiar todo
./docker-utils.sh help     # Ver ayuda
```

## 🌐 URLs de Acceso

| Entorno | URL | Puerto |
|---------|-----|--------|
| **Desarrollo** | http://localhost:4200 | 4200 |
| **Producción** | http://localhost | 80 |
| **Backend** (si está habilitado) | http://localhost:8080 | 8080 |
| **PostgreSQL** | localhost:5432 | 5432 |

## ⚙️ Configuración de Entornos

### **Desarrollo** (`environment.docker.ts`)
- Node.js 20.19.0
- Hot reload activado
- Logs debug
- API: http://localhost:8080

### **Producción** (`environment.prod.ts`)
- Build optimizado
- Servidor Nginx
- Logs mínimos
- API: http://backend:8080 (Docker network)

## 🔍 Verificación y Debugging

### **Health Checks**
```bash
# Ver estado de contenedores
docker ps --filter "name=bonofacil"

# Verificar logs específicos
docker logs bonofacil-frontend-dev

# Verificar salud
docker inspect --format='{{.State.Health.Status}}' bonofacil-frontend-dev
```

### **Solución de Problemas**

#### **Puerto ya en uso**
```bash
# Matar proceso en puerto 4200
npx kill-port 4200

# O cambiar puerto en docker-compose.yml
ports:
  - "4201:4200"  # Puerto externo:interno
```

#### **Hot reload no funciona**
```bash
# Verificar que los volúmenes estén montados
docker-compose exec bonofacil-frontend-dev ls -la /app

# Verificar polling (ya configurado)
ng serve --host 0.0.0.0 --poll 2000
```

#### **Permisos (Linux/Mac)**
```bash
# Cambiar propietario de node_modules
sudo chown -R $USER:$USER node_modules

# O limpiar y reinstalar
npm run docker:clean
npm run docker:dev
```

## 🏗️ Arquitectura de Contenedores

### **Desarrollo**
```
┌─────────────────────────────────────┐
│           Host System               │
│  ┌─────────────────────────────────┐│
│  │     bonofacil-frontend-dev      ││
│  │   Node.js 20.19.0 + Angular    ││
│  │        Port: 4200               ││
│  │     Hot Reload: ✅              ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### **Producción**
```
┌─────────────────────────────────────┐
│           Host System               │
│  ┌─────────────────────────────────┐│
│  │      bonofacil-frontend         ││
│  │        Nginx + Static           ││
│  │         Port: 80                ││
│  │      Optimized: ✅              ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │      bonofacil-backend          ││
│  │       Spring Boot               ││
│  │         Port: 8080              ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │        PostgreSQL               ││
│  │         Port: 5432              ││
│  │     Persistent Volume           ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## 🎯 Beneficios de esta Configuración

### **✅ Desarrollo**
- **Node.js 20.19.0** garantizado (soluciona el problema original)
- **Hot reload** funcional
- **Debugging** fácil
- **Aislamiento** del sistema host

### **✅ Producción**
- **Multi-stage build** (imagen optimizada)
- **Nginx** como proxy reverso
- **Health checks** automáticos
- **Escalabilidad** horizontal

### **✅ DevOps**
- **CI/CD ready**
- **Environment parity**
- **Easy deployment**
- **Monitoring** integrado

## 🚨 Notas Importantes

1. **Primer inicio**: Puede tardar varios minutos descargando imágenes
2. **Hot reload**: Funciona con volúmenes montados
3. **Backend**: Descomenta en docker-compose.yml si tienes backend
4. **HTTPS**: Agregar certificados SSL para producción
5. **Secrets**: Usar Docker secrets para contraseñas en producción

¡Tu aplicación Angular ahora está completamente dockerizada! 🎉
