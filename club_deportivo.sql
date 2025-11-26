CREATE DATABASE Club_Deportivo;

CREATE TABLE usuarios(
	id INT auto_increment primary key,
    usuario varchar(100) unique,
    password varchar(100)
    );
    
insert into usuarios (usuario, password)
values('pepe', '1234');

select * from usuarios;