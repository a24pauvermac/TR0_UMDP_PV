# Dockerfile per al quiz de banderes
FROM php:8.4-fpm

# Instal·lar extensions PHP necessàries
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Instal·lar dependències del sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Instal·lar extensió ZIP
RUN docker-php-ext-install zip

# Crear directori de treball
WORKDIR /var/www/html

# Copiar arxius del projecte
COPY .. /var/www/html/

# Establir permisos
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Crear directori per a uploads
RUN mkdir -p /var/www/html/assets/uploads/banderas
RUN chown -R www-data:www-data /var/www/html/assets
RUN chmod -R 777 /var/www/html/assets

# Exposar port 9000 (PHP-FPM)
EXPOSE 9000
