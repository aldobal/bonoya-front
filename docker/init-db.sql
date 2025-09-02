-- Script de inicialización de base de datos para Docker
-- Este script se ejecuta cuando se crea el contenedor de PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tablas de ejemplo (ajustar según tu backend)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

-- Insertar roles por defecto
INSERT INTO roles (name, description) VALUES 
    ('ROLE_ADMIN', 'Administrador del sistema'),
    ('ROLE_EMISOR', 'Usuario emisor de bonos'),
    ('ROLE_INVERSOR', 'Usuario inversor')
ON CONFLICT (name) DO NOTHING;

-- Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Comentario informativo
COMMENT ON DATABASE bonofacil_prod IS 'Base de datos de producción para BonoFácil';
