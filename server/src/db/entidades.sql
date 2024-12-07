CREATE DATABASE IF NOT EXISTS db_servicio;
USE db_servicio;

-- ENTIDAD DE LA CATEGORIA.
CREATE TABLE IF NOT EXISTS CATEGORIA (
  idCATEGORIA CHAR(36) NOT NULL ,
  descripcion VARCHAR(45) NOT NULL UNIQUE,
  esServicio INT NULL DEFAULT 0,
  PRIMARY KEY(idCATEGORIA)
) 
ENGINE = InnoDB;

-- ENTIDAD DEL EQUIPO
CREATE TABLE  IF NOT EXISTS EQUIPO(
  idequipo CHAR(36) NOT NULL,
  nombreequipo VARCHAR(45) NOT NULL UNIQUE,
  PRIMARY KEY(idequipo)
)

-- ENTIDAD DE LA MARCA
CREATE TABLE  IF NOT EXISTS MARCA(
  idMarca CHAR(36) NOT NULL,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY(idMarca)
)

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
CREATE TABLE IF NOT EXISTS SERVICIO_EQUIPOS (
  idservicioequipos CHAR(36) NOT NULL,
  EQUIPO_idequipo CHAR(36) NOT NULL,
  marca_idMarca CHAR(36) NOT NULL,
  modelo VARCHAR(45),
  serie VARCHAR(45),
  codigo_barras VARCHAR(45),
  PRIMARY KEY(idservicioequipos),
  FOREIGN KEY(EQUIPO_idequipo) REFERENCES  EQUIPO(idequipo) ON  DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY(marca_idMarca) REFERENCES MARCA(idMarca) ON DELETE NO ACTION ON UPDATE NO ACTION
);
