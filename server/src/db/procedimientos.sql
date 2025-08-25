-----------------------------------------------------------
-- PROCEDIMIENTOS DE LA TABLA (CATEGORIA)
-----------------------------------------------------------
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_categoria`(
  IN _idCATEGORIA CHAR(36),
  IN _descripcion VARCHAR(45)

)
BEGIN
  INSERT INTO CATEGORIA(idCATEGORIA,descripcion)
  VALUES(_idCATEGORIA,_descripcion);
END
-----------------------------------------------------------
-- PROCEDIMIENTOS ALMACENADOS DE LA TABLA (EQUIPO)
-----------------------------------------------------------
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_equipo`(
 IN _idequipo VARCHAR(36),
 IN _nombreequipo VARCHAR(45)
)
BEGIN
INSERT INTO EQUIPO(idequipo,nombreequipo)
VALUES( _idequipo, _nombreequipo);
END

-----------------------------------------------------------
-- PROCEDIMIENTOS ALMACENADOS DE LA TABLA (MARCA)
-----------------------------------------------------------
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_marca`(
 IN _idMarca CHAR(36),
 IN _nombre VARCHAR(50)
)
BEGIN
   INSERT INTO MARCA(idMarca,nombre)
   VALUES( _idMarca, _nombre);
END


-----------------------------------------------------------
-- PROCEDIMIENTOS ALMACENADOS DE LA TABLA (TIPO_DOCUMENTO)
---------------------------------------------------------
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_tipoDocumento`(
  IN _cod_tipo CHAR(3),
  IN _nombre_tipo VARCHAR(45),
  IN _cant_digitos INT
)
BEGIN
INSERT INTO TIPO_DOCUMENTO(
   cod_tipo, nombre_tipo, cant_digitos
)
VALUES(_cod_tipo,_nombre_tipo,_cant_digitos);

END



-----------------------------------------------------------
-- PROCEDIMIENTOS ALMACENADOS DE LA TABLA (CLIENTE)
---------------------------------------------------------

  CREATE DEFINER=`root`@`localhost` PROCEDURE `getAllCliente`(
    IN _filtro varchar(20)
  )
  BEGIN
    IF _filtro = '' THEN
        SELECT * FROM CLIENTE;
    ELSE
        SELECT * FROM CLIENTE WHERE nombre LIKE CONCAT('%', _filtro, '%');
    END IF;

  END



  -----------------------------------------------------------
-- PROCEDIMIENTOS ALMACENADOS DE LA TABLA (TECNICO)
-------------------------------------------------------------
CREATE PROCEDURE `add_tecnico` (
   IN _idTecnico CHAR(36) ,
    IN _nombre VARCHAR(75),
	IN _dni CHAR(8),
	IN _celular VARCHAR(9),
    IN _usuario VARCHAR(45),
    IN _password VARCHAR(45)
)
BEGIN

INSERT INTO TECNICO 
      (idTecnico, nombre, dni, celular, usuario, password)
VALUES(_idTecnico, _nombre, _dni, _celular, _usuario, _password);

END


---- 2025--------------
 ------ login --------

DELIMITER $$

CREATE DEFINER=`root`@`localhost` PROCEDURE `auth_login`(IN _usuario VARCHAR(100))
BEGIN
    SELECT 
        u.id,
        u.nombre,
        u.apellidos,
        u.dni,
        u.telefono,
        u.usuario,
        u.password,
        u.rol_id,
        r.tipo_rol AS rol
    FROM usuarios u
    INNER JOIN roles r ON u.rol_id = r.id
    WHERE u.usuario = _usuario
    LIMIT 1;
END$$

DELIMITER ;


----------- marca -----------------


DELIMITER //

CREATE PROCEDURE sp_marca(
    IN _accion VARCHAR(50),
    IN _id INT,
    IN _nombre VARCHAR(100),
    IN _pageIndex INT,
    IN _pageSize INT,
    IN _idUsuario INT
)
BEGIN
    DECLARE _rol_id INT;
    DECLARE _permiso_id INT;
    DECLARE _offset INT;

    -- Obtener el rol del usuario
    SELECT rol_id INTO _rol_id FROM usuarios WHERE id = _idUsuario;
    
    -- Verificar si el usuario existe
    IF _rol_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Verificar permisos
    IF _accion = 'LISTAR_MARCA' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'LISTAR_MARCA';
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acción no válida';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM rol_permisos 
        WHERE rol_id = _rol_id AND permiso_id = _permiso_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acceso denegado: No tienes permiso para realizar esta acción';
    END IF;

    -- Listar marcas con paginación
    IF _accion = 'LISTAR_MARCA' THEN
        SET _offset = _pageIndex * _pageSize; -- Calcular OFFSET
        SELECT SQL_CALC_FOUND_ROWS * 
        FROM marca 
        ORDER BY idMarca ASC -- Usar la columna correcta
        LIMIT _pageSize OFFSET _offset;
        SELECT FOUND_ROWS() AS total;
    END IF;
END //

DELIMITER ;




DELIMITER //

CREATE PROCEDURE sp_marca_crud(
    IN _accion VARCHAR(50),
    IN _id INT,
    IN _nombre VARCHAR(100),
    IN _idUsuario INT
)
BEGIN
    DECLARE _rol_id INT;
    DECLARE _permiso_id INT;

    -- Obtener el rol del usuario
    SELECT rol_id INTO _rol_id FROM usuarios WHERE id = _idUsuario;
    
    -- Verificar si el usuario existe
    IF _rol_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Verificar permisos
    IF _accion = 'INSERTAR_MARCA' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'INSERTAR_MARCA';
    ELSEIF _accion = 'ACTUALIZAR_MARCA' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'ACTUALIZAR_MARCA';
    ELSEIF _accion = 'ELIMINAR_MARCA' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'ELIMINAR_MARCA';
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acción no válida';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM rol_permisos 
        WHERE rol_id = _rol_id AND permiso_id = _permiso_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acceso denegado: No tienes permiso para realizar esta acción';
    END IF;

    -- Ejecutar la acción correspondiente
    IF _accion = 'INSERTAR_MARCA' THEN
        INSERT INTO marca (nombre) VALUES (_nombre);
        SELECT LAST_INSERT_ID() AS id_insertado;
    ELSEIF _accion = 'ACTUALIZAR_MARCA' THEN
        UPDATE marca SET nombre = _nombre WHERE idMarca = _id; -- Usar idMarca
        SELECT ROW_COUNT() AS filas_afectadas;
    ELSEIF _accion = 'ELIMINAR_MARCA' THEN
        DELETE FROM marca WHERE idMarca = _id; -- Usar idMarca
        SELECT ROW_COUNT() AS filas_afectadas;
    END IF;
END //

DELIMITER ;


-------- equipo ------------

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_equipo`(
    IN _accion VARCHAR(50),
    IN _id INT,
    IN _nombre VARCHAR(100),
    IN _pageIndex INT,
    IN _pageSize INT,
    IN _idUsuario INT
)
BEGIN
    DECLARE _rol_id INT;
    DECLARE _permiso_id INT;
    DECLARE _offset INT;
    -- Obtener el rol del usuario
    SELECT rol_id INTO _rol_id FROM usuarios WHERE id = _idUsuario;
   
    -- Verificar si el usuario existe
    IF _rol_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    -- Verificar permisos
    IF _accion = 'LISTAR_EQUIPO' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'LISTAR_EQUIPO';
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acción no válida';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM rol_permisos
        WHERE rol_id = _rol_id AND permiso_id = _permiso_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acceso denegado: No tienes permiso para realizar esta acción';
    END IF;
    -- Listar equipos con paginación
    IF _accion = 'LISTAR_EQUIPO' THEN
        SET _offset = _pageIndex * _pageSize; -- Calcular OFFSET
        SELECT SQL_CALC_FOUND_ROWS *
        FROM equipo
        ORDER BY idequipo ASC
        LIMIT _pageSize OFFSET _offset;
        SELECT FOUND_ROWS() AS total;
    END IF;
END;

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_equipo_crud`(
    IN _accion VARCHAR(50),
    IN _id INT,
    IN _nombre VARCHAR(100),
    IN _idUsuario INT
)
BEGIN
    DECLARE _rol_id INT;
    DECLARE _permiso_id INT;
    -- Obtener el rol del usuario
    SELECT rol_id INTO _rol_id FROM usuarios WHERE id = _idUsuario;
   
    -- Verificar si el usuario existe
    IF _rol_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;
    -- Verificar permisos
    IF _accion = 'INSERTAR_EQUIPO' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'INSERTAR_EQUIPO';
    ELSEIF _accion = 'ACTUALIZAR_EQUIPO' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'ACTUALIZAR_EQUIPO';
    ELSEIF _accion = 'ELIMINAR_EQUIPO' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'ELIMINAR_EQUIPO';
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acción no válida';
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM rol_permisos
        WHERE rol_id = _rol_id AND permiso_id = _permiso_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acceso denegado: No tienes permiso para realizar esta acción';
    END IF;
    -- Ejecutar la acción correspondiente
    IF _accion = 'INSERTAR_EQUIPO' THEN
        INSERT INTO equipo (nombreequipo) VALUES (_nombre);
        SELECT LAST_INSERT_ID() AS id_insertado;
    ELSEIF _accion = 'ACTUALIZAR_EQUIPO' THEN
        UPDATE equipo SET nombreequipo = _nombre WHERE idequipo = _id;
        SELECT ROW_COUNT() AS filas_afectadas;
    ELSEIF _accion = 'ELIMINAR_EQUIPO' THEN
        DELETE FROM equipo WHERE idequipo = _id;
        SELECT ROW_COUNT() AS filas_afectadas;
    END IF;
END;

-------------- tipo documento -------------------

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tipo_documento`(  
	IN _accion VARCHAR(50),
    IN _id INT,
    IN _nombre VARCHAR(100),
    IN _pageIndex INT,
    IN _pageSize INT,
    IN _idUsuario INT
)
BEGIN
    DECLARE _rol_id INT;
    DECLARE _permiso_id INT;
    DECLARE _offset INT;

    -- Obtener el rol del usuario
    SELECT rol_id INTO _rol_id FROM usuarios WHERE id = _idUsuario;
    
    -- Verificar si el usuario existe
    IF _rol_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Verificar permisos
    IF _accion = 'LISTAR_TIPO_DOC' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'LISTAR_TIPO_DOC';
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acción no válida';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM rol_permisos 
        WHERE rol_id = _rol_id AND permiso_id = _permiso_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acceso denegado: No tienes permiso para realizar esta acción';
    END IF;

    -- Listar marcas con paginación
    IF _accion = 'LISTAR_TIPO_DOC' THEN
        SET _offset = _pageIndex * _pageSize; -- Calcular OFFSET
        SELECT SQL_CALC_FOUND_ROWS * 
        FROM tipo_documento 
        ORDER BY cod_tipo ASC -- Usar la columna correcta
        LIMIT _pageSize OFFSET _offset;
        SELECT FOUND_ROWS() AS total;
    END IF;
END


-------- productos ---------

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_producto`(
    IN _accion VARCHAR(50),
    IN _id INT,
    IN _nombre VARCHAR(100),
    IN _pageIndex INT,
    IN _pageSize INT,
    IN _idUsuario INT
)
BEGIN
    DECLARE _rol_id INT;
    DECLARE _permiso_id INT;
    DECLARE _offset INT;

    -- Obtener el rol del usuario
    SELECT rol_id INTO _rol_id FROM usuarios WHERE id = _idUsuario;
    
    -- Verificar si el usuario existe
    IF _rol_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Verificar permisos
    IF _accion = 'LISTAR_PRODUCTO' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'LISTAR_PRODUCTO';
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acción no válida';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM rol_permisos 
        WHERE rol_id = _rol_id AND permiso_id = _permiso_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acceso denegado: No tienes permiso para realizar esta acción';
    END IF;

    -- Listar productos con paginación y nombre de categoría
    IF _accion = 'LISTAR_PRODUCTO' THEN
        SET _offset = _pageIndex * _pageSize; -- Calcular OFFSET
        SELECT p.*, c.descripcion  AS categoria_nombre
        FROM productos p
        INNER JOIN categoria c ON p.categoria_id = c.idCATEGORIA
        ORDER BY p.id ASC
        LIMIT _pageSize OFFSET _offset;

        SELECT FOUND_ROWS() AS total;
    END IF;
END


CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_producto_crud`(
    IN _accion VARCHAR(50),
    IN _id INT,
    IN _nombre VARCHAR(150),
    IN _descripcion TEXT,
    IN _precio_compra DECIMAL(10,2),
    IN _precio_venta DECIMAL(10,2),
    IN _stock INT,
    IN _categoria_id INT,
    IN _idUsuario INT
)
BEGIN
    DECLARE _rol_id INT;
    DECLARE _permiso_id INT;

    -- Obtener el rol del usuario
    SELECT rol_id INTO _rol_id FROM usuarios WHERE id = _idUsuario;

    -- Verificar si el usuario existe
    IF _rol_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Usuario no encontrado';
    END IF;

    -- Verificar permisos
    IF _accion = 'INSERTAR_PRODUCTO' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'INSERTAR_PRODUCTO';
    ELSEIF _accion = 'ACTUALIZAR_PRODUCTO' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'ACTUALIZAR_PRODUCTO';
    ELSEIF _accion = 'ELIMINAR_PRODUCTO' THEN
        SELECT id INTO _permiso_id FROM permisos WHERE nombre = 'ELIMINAR_PRODUCTO';
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acción no válida';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM rol_permisos 
        WHERE rol_id = _rol_id AND permiso_id = _permiso_id
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Acceso denegado: No tienes permiso para realizar esta acción';
    END IF;

    -- Ejecutar la acción correspondiente
    IF _accion = 'INSERTAR_PRODUCTO' THEN
        INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, stock, categoria_id)
        VALUES (_nombre, _descripcion, _precio_compra, _precio_venta, _stock, _categoria_id);
        SELECT LAST_INSERT_ID() AS id_insertado;

    ELSEIF _accion = 'ACTUALIZAR_PRODUCTO' THEN
        UPDATE productos
        SET nombre = _nombre,
            descripcion = _descripcion,
            precio_compra = _precio_compra,
            precio_venta = _precio_venta,
            stock = _stock,
            categoria_id = _categoria_id,
            updated_at = NOW()
        WHERE id = _id;
        SELECT ROW_COUNT() AS filas_afectadas;

    ELSEIF _accion = 'ELIMINAR_PRODUCTO' THEN
        DELETE FROM productos WHERE id = _id;
        SELECT ROW_COUNT() AS filas_afectadas;
    END IF;
END

