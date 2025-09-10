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


CREATE TABLE `SERVICIO` (
    `idservicio` BIGINT NOT NULL AUTO_INCREMENT,
    `fechaingreso` DATETIME NOT NULL,
    `MOTIVO_INGRESO_idMOTIVO_INGRESO` BIGINT NOT NULL,
    `descripcion_motivo` VARCHAR(95) NULL,
    `observacion` VARCHAR(150) NULL,
    `diagnostico` VARCHAR(150) NULL,
    `solucion` VARCHAR(150) NULL,
    `precio` DOUBLE NOT NULL DEFAULT 0.0,
    `TECNICO_idTecnicoRecibe` INT NOT NULL,
    `TECNICO_idTecnicoSoluciona` INT NOT NULL,
    `fechaentrega` DATETIME NULL,
    `preciorepuestos` DOUBLE NOT NULL DEFAULT 0.0,
    `estado` INT NULL DEFAULT 1,
    `precioTotal` DOUBLE NULL DEFAULT 0.0,
    `SERVICIO_EQUIPOS_idservicioequipos` INT NOT NULL,
    `CLIENTE_idCliente` INT NOT NULL,
    PRIMARY KEY (`idservicio`),

    -- Índices para mejorar el rendimiento de las consultas que involucran claves foráneas
    INDEX `idx_MOTIVO_INGRESO` (`MOTIVO_INGRESO_idMOTIVO_INGRESO`),
    INDEX `idx_TECNICO_idTecnicoRecibe` (`TECNICO_idTecnicoRecibe`),
    INDEX `idx_TECNICO_idTecnicoSoluciona` (`TECNICO_idTecnicoSoluciona`),
    INDEX `idx_SERVICIO_EQUIPOS` (`SERVICIO_EQUIPOS_idservicioequipos`),
    INDEX `idx_CLIENTE` (`CLIENTE_idCliente`),

    -- Relaciones con llaves foráneas
    CONSTRAINT `fk_SERVICIO_MOTIVO_INGRESO`
        FOREIGN KEY (`MOTIVO_INGRESO_idMOTIVO_INGRESO`)
        REFERENCES `MOTIVO_INGRESO` (`idMOTIVO_INGRESO`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_SERVICIO_TECNICO_RECIBE`
        FOREIGN KEY (`TECNICO_idTecnicoRecibe`)
        REFERENCES `TECNICO` (`idTecnico`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_SERVICIO_TECNICO_SOLUCIONA`
        FOREIGN KEY (`TECNICO_idTecnicoSoluciona`)
        REFERENCES `TECNICO` (`idTecnico`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_SERVICIO_SERVICIO_EQUIPOS`
        FOREIGN KEY (`SERVICIO_EQUIPOS_idservicioequipos`)
        REFERENCES `SERVICIO_EQUIPOS` (`idservicioequipos`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_SERVICIO_CLIENTE`
        FOREIGN KEY (`CLIENTE_idCliente`)
        REFERENCES `CLIENTE` (`idCliente`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
) ENGINE=InnoDB;