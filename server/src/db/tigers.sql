DELIMITER //

CREATE TRIGGER trg_cod_insert_servicio_client
BEFORE INSERT ON SERVICIO
FOR EACH ROW
BEGIN
    DECLARE v_codigo VARCHAR(7);
    DECLARE existe INT DEFAULT 1;

    WHILE existe > 0 DO
        -- Generar 3 caracteres aleatorios (A-Z, 0-9) + '-' + 3 caracteres aleatorios (A-Z, 0-9)
        SET v_codigo = CONCAT(
            ELT(FLOOR(1 + (RAND() * 36)),
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '0','1','2','3','4','5','6','7','8','9'),
            ELT(FLOOR(1 + (RAND() * 36)),
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '0','1','2','3','4','5','6','7','8','9'),
            ELT(FLOOR(1 + (RAND() * 36)),
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '0','1','2','3','4','5','6','7','8','9'),
            '-',
            ELT(FLOOR(1 + (RAND() * 36)),
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '0','1','2','3','4','5','6','7','8','9'),
            ELT(FLOOR(1 + (RAND() * 36)),
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '0','1','2','3','4','5','6','7','8','9'),
            ELT(FLOOR(1 + (RAND() * 36)),
                'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
                '0','1','2','3','4','5','6','7','8','9')
        );

        -- Verificar que no exista
        SELECT COUNT(*) INTO existe
        FROM SERVICIO
        WHERE codigoSeguimiento = v_codigo;
    END WHILE;

    SET NEW.codigoSeguimiento = v_codigo;
END;
//

DELIMITER ;
