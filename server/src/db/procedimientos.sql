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