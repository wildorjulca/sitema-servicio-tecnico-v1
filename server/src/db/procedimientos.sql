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
