CREATE DATABASE IF NOT EXISTS db_servicio;
USE db_servicio;

-- ENTIDAD DE LA CATEGORIA.
CREATE TABLE CATEGORIA (
    idCATEGORIA INT NOT NULL AUTO_INCREMENT,
    descripcion VARCHAR(45) NOT NULL,
    esServicio INT DEFAULT 0
    PRIMARY KEY (idCATEGORIA)
);

-- ENTIDAD MARCA. 

CREATE TABLE MARCA (
    idMarca INT NOT NULL auto_increment primary key,
    nombre VARCHAR(50) NOT NULL
)

-- ENTIDAD DE LA EQUIPO.

CREATE TABLE EQUIPO (
    idequipo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombreequipo VARCHAR(45) NOT NULL
);

-- ENTIDAD DE LA TABLA DEL TIPO DE DOCUMENTO
CREATE TABLE IF NOT EXISTS TIPO_DOCUMENTO (
  cod_tipo CHAR(3) NOT NULL,
  nombre_tipo VARCHAR(45) NOT NULL UNIQUE,
  cant_digitos INT NOT NULL,
  PRIMARY KEY (cod_tipo)
)

-- ENTIDAD DE LA TABLA DEL CLIENTE
CREATE TABLE IF NOT EXISTS CLIENTE (
  idCliente CHAR(36) NOT NULL, 
  nombre VARCHAR(75) NOT NULL, 
  TIPO_DOCUMENTO_cod_tipo CHAR(3) NOT NULL, 
  numero_documento CHAR(11) NOT NULL UNIQUE, 
  direccion VARCHAR(75) NULL, 
  telefono VARCHAR(45) NULL, 
  PRIMARY KEY (idCliente),
    FOREIGN KEY (TIPO_DOCUMENTO_cod_tipo) 
    REFERENCES TIPO_DOCUMENTO (cod_tipo)
    ON DELETE NO ACTION  -- Si se intenta eliminar un tipo de documento en uso, no se permite
    ON UPDATE NO ACTION  -- Si se actualiza un tipo de documento, no afecta a CLIENTE
) 

-- ENTIDAD DE LA TABLA DEL MOTIVO DE INGRESO
CREATE TABLE IF NOT EXISTS MOTIVO_INGRESO (
  idMOTIVO_INGRESO CHAR(36) NOT NULL,
  descripcion VARCHAR(95) NOT NULL,
  precio_cobrar DOUBLE NOT NULL,
  PRIMARY KEY(idMOTIVO_INGRESO)
);

-- ENTIDAD DE LA TABLA SEL SERVICIO_EQUIPOS 
CREATE TABLE SERVICIO_EQUIPOS (
  idServicioEquipos INT AUTO_INCREMENT PRIMARY KEY,
  EQUIPO_idEquipo INT NOT NULL,
  MARCA_idMarca INT NOT NULL,
  modelo VARCHAR(45),
  serie VARCHAR(45),
  codigo_barras VARCHAR(45),
  FOREIGN KEY (EQUIPO_idEquipo) REFERENCES EQUIPO(idEquipo)
      ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (MARCA_idMarca) REFERENCES MARCA(idMarca)
      ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB;



-- ENTIDAD DE LA TABLA DEL TECNICO
CREATE TABLE IF NOT EXISTS TECNICO (
  idTecnico CHAR(36),
  nombre VARCHAR(75) NOT NULL,
  dni CHAR(8) NOT NULL,
  celular VARCHAR(9) NULL,
  usuario VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTecnico`)
);


  -- Tabla roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_rol VARCHAR(50) NOT NULL
);

-- Tabla permisos
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100)
);

-- Tabla intermedia rol_permisos (muchos a muchos)
CREATE TABLE rol_permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    permiso_id INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uniq_rol_permiso (rol_id, permiso_id)
);


-- Tabla usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni INT NOT NULL UNIQUE,
    telefono INT,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

------- tabla productos --------

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_compra DECIMAL(10,2) NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria_id INT NOT NULL,
    estado TINYINT DEFAULT 1, -- 1 = activo, 0 = inactivo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categoria(idCATEGORIA)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

------- producto imagen ----------

CREATE TABLE producto_imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
