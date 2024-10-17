# Imagem base
FROM php:8.2-apache

ARG WWWGROUP

COPY . /var/www/html

USER root

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql

COPY ./vhost.conf /etc/apache2/sites-available/000-default.conf

COPY .envkube .env

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

#RUN chown -R www-data:www-data /var/www/html
RUN chown -R www-data:www-data /var/www/html \
    && chmod 775 -R /var/www/html/storage

RUN a2enmod rewrite

# Ajustar o memory_limit 512
RUN echo "memory_limit=512M" > /usr/local/etc/php/conf.d/custom-php.ini

