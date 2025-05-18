# PROYECTO FINAL - MÓDULO 3

## Descripción
Proyecto de API RESTful para el tercer módulo del curso de Backend de CoderHouse. Implementa un sistema de gestión de carritos de compra con autenticación de usuarios, gestión de productos y procesamiento de órdenes.

## Requisitos Cumplidos

### 1. Dockerfile y Docker Hub
Se ha creado un Dockerfile para generar una imagen del proyecto y se ha subido a Docker Hub:

- Para acceder a la documentación:
```bash
# Visite:
https://hub.docker.com/r/gabuuu2025/entregafinal3
```

#### Instrucciones de uso:
##### Opción 1:

Crea un archivo .env junto con un archivo .yml con la siguiente configuración:
```bash
version: '3.8'

services: 
  app:
    image: gabuuu2025/entregafinal3:latest
    restart: always
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - MONGO_URI=${MONGO_URI}
      - SECRET_JWT=${SECRET_JWT}
      - GOOGLE_EMAIL=alejandroalahi@gmail.com
      - PASSWORD_GOOGLE_APP=12345
```
- Ejecutar:
```bash
docker compose up
```

##### Opción 2:

Crea un archivo .env y ejecute:

```bash
docker run -p 8080:8080 --env-file .env gabuuu2025/entregafinal3:latest
```


### 2. Test Funcionales

Se han desarrollado tests funcionales para todos los endpoints del router de carritos, cubriendo operaciones de listado, creación, actualización, compra y eliminación de carritos.

- Para ejecutar los tests debe hacerlos dentro del contenedor:
```bash
docker exec -it probando_proyecto-app-1 npm test
```
- O quizas le pida ejecutarlo de la siguiente manera segun su sistema operativo
```bash
winpty docker exec -it probando_proyecto-app-1 npm test
```


### 3. Documentación con Swagger

Se ha documentado completamente el módulo de Users/Autenticación utilizando Swagger. La documentación incluye endpoints de registro, login, gestión de perfiles y control de roles.

- Para acceder a la documentación:

```bash
# Inicie la aplicación y visite:
http://localhost:8080/documentation
```



### Detalles Técnicos

##### Estructura de Módulos:

- Autenticación: Sistema completo con JWT y cookies
- Productos: CRUD completo con validaciones
- Carritos: Gestión completa de carritos de compra
- Órdenes: Procesamiento y seguimiento

##### Consideraciones para Testing

- Los tests generan y eliminan sus propios datos de prueba
- Se requiere conexión a MongoDB Atlas
- Se verifican tanto casos exitosos como manejo de errores

# IMPORTANTE:

- La aplicación está configurada para conectarse a MongoDB Atlas

- No es necesario clonar el repositorio para usar la aplicación, basta con utilizar la imagen de Docker

- Debe tener instalado Docker Engine y/o Docker compose V2.