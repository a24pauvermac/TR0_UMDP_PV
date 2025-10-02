# 🐳 Quiz de Banderes - Docker Setup

## 📋 Requisits

- Docker
- Docker Compose

## 🚀 Començar amb Docker

### 1. Construir i executar els contenidors
```bash
docker-compose up --build
```

### 2. Accedir a l'aplicació
- **Quiz**: http://localhost:8080/index.html
- **Admin**: http://localhost:8080/admin.html
- **MySQL**: localhost:3306

## 🛠️ Comandos útils

### Aturar els contenidors
```bash
docker-compose down
```

### Veure logs
```bash
docker-compose logs -f
```

### Accedir al contenidor PHP
```bash
docker exec -it quiz_php bash
```

### Accedir a MySQL
```bash
docker exec -it quiz_mysql mysql -u quiz_user -p quiz_banderas
```

## 📁 Estructura de Docker

- **nginx**: Servidor web (port 8080)
- **php**: PHP-FPM amb extensions necessàries
- **mysql**: Base de dades MySQL 8.0 (port 3306)

## 🗄️ Base de dades

- **Nom**: quiz_banderas
- **Usuari**: quiz_user
- **Contrasenya**: quiz_password
- **Root password**: rootpassword

## 📝 Notes

- Les dades de MySQL es persisteixen en un volum
- El directori `uploads/` es crea automàticament
- La configuració Nginx optimitza els arxius estàtics
