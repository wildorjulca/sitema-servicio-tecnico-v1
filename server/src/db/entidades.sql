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
  id_tipo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  cod_tipo CHAR(3) NOT NULL UNIQUE,
  nombre_tipo VARCHAR(45) NOT NULL UNIQUE,
  cant_digitos INT NOT NULL
);

-- ENTIDAD DE LA TABLA DEL CLIENTE
CREATE TABLE IF NOT EXISTS CLIENTE (
  idCliente INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(75) NOT NULL,
  apellidos VARCHAR(75) NOT NULL,
  tipo_doc_id INT NOT NULL,
  numero_documento CHAR(15) NOT NULL UNIQUE,
  direccion VARCHAR(75) NULL,
  telefono VARCHAR(45) NULL,
  PRIMARY KEY (idCliente),
  CONSTRAINT fk_cliente_tipodoc
    FOREIGN KEY (tipo_doc_id) REFERENCES TIPO_DOCUMENTO (id_tipo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ENTIDAD DE LA TABLA DEL MOTIVO DE INGRESO
CREATE TABLE IF NOT EXISTS MOTIVO_INGRESO (
  idMotivo INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(100) NOT NULL,
  precio_cobrar DOUBLE NULL,
  PRIMARY KEY (idMotivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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


CREATE TABLE `servicio` (
  `idServicio` bigint NOT NULL AUTO_INCREMENT,
  `codigoSeguimiento` varchar(7) NOT NULL,
  `fechaIngreso` datetime NOT NULL,
  `motivo_ingreso_id` int NOT NULL,
  `descripcion_motivo` varchar(95) DEFAULT NULL,
  `observacion` varchar(150) DEFAULT NULL,
  `diagnostico` varchar(150) DEFAULT NULL,
  `solucion` varchar(150) DEFAULT NULL,
  `precio` double NOT NULL DEFAULT '0',
  `usuario_recibe_id` int NOT NULL,
  `usuario_soluciona_id` int DEFAULT NULL,
  `fechaEntrega` datetime DEFAULT NULL,
  `precioRepuestos` double NOT NULL DEFAULT '0',
  `estado_id` int DEFAULT NULL,
  `precioTotal` double DEFAULT '0',
  `servicio_equipos_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  PRIMARY KEY (`idServicio`),
  UNIQUE KEY `codigoSeguimiento` (`codigoSeguimiento`),
  KEY `idx_codigoSeguimiento` (`codigoSeguimiento`),
  KEY `idx_cliente` (`cliente_id`),
  KEY `fk_servicio_motivo` (`motivo_ingreso_id`),
  KEY `fk_servicio_usuario_recibe` (`usuario_recibe_id`),
  KEY `fk_servicio_usuario_soluciona` (`usuario_soluciona_id`),
  KEY `fk_servicio_equipo` (`servicio_equipos_id`),
  KEY `fk_servicio_estado` (`estado_id`),
  CONSTRAINT `fk_servicio_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`idCliente`),
  CONSTRAINT `fk_servicio_equipo` FOREIGN KEY (`servicio_equipos_id`) REFERENCES `servicio_equipos` (`idServicioEquipos`),
  CONSTRAINT `fk_servicio_estado` FOREIGN KEY (`estado_id`) REFERENCES `estado_servicio` (`idEstado`),
  CONSTRAINT `fk_servicio_motivo` FOREIGN KEY (`motivo_ingreso_id`) REFERENCES `motivo_ingreso` (`idMotivo`),
  CONSTRAINT `fk_servicio_usuario_recibe` FOREIGN KEY (`usuario_recibe_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_servicio_usuario_soluciona` FOREIGN KEY (`usuario_soluciona_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


-- estado para servicio -----

CREATE TABLE estado_servicio (
  idEstado INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (idEstado)
);