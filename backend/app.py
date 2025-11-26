from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
# Esta configuración habilita CORS para TODOs el sitio y TODAS las rutas
CORS(app, resources={r"/*": {"origins": "*"}})

# --- Función de Base de Datos ---
def conectar_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="club_deportivo"
    )

# --- Rutas ---

@app.route('/')
def inicio():
    return jsonify({"mensaje": "Servidor Python activo 🐍"})

@app.route('/login', methods=['POST'])
def login():
    datos = request.get_json()
    usuario = datos.get('usuario')
    password = datos.get('password')
    
    db = conectar_db()
    cursor = db.cursor(dictionary=True)
    
    # Verificamos usuario Y contraseña en la BD
    cursor.execute("SELECT * FROM usuarios WHERE usuario = %s AND password = %s", (usuario, password))
    user = cursor.fetchone()
    
    cursor.close()
    db.close()

    if user:
        rol_usuario = user.get('rol', 'socio')
        # ¡IMPORTANTE! Devolvemos también el ID para usarlo en el frontend
        return jsonify({"mensaje": "Login exitoso", "status": "ok", "id": user['id'], "usuario": user['usuario'], "rol": rol_usuario})
    else:
        return jsonify({"mensaje": "Datos incorrectos", "status": "error"})

@app.route('/registro', methods=['POST'])
def registro():
    datos = request.get_json()
    usuario = datos.get('usuario')
    password = datos.get('password')
    
    print(f"Intento de registro: {usuario}")

    try:
        db = conectar_db()
        cursor = db.cursor()
        # Insertamos el usuario
        sql = "INSERT INTO usuarios (usuario, password) VALUES (%s, %s)"
        cursor.execute(sql, (usuario, password))
        db.commit() # ¡Importante para guardar!
        
        cursor.close()
        db.close()
        
        print("¡Usuario guardado en BD!")
        return jsonify({"mensaje": "Registro exitoso", "status": "ok"})
        
    except Exception as e:
        print(f"Error en BD: {e}")
        return jsonify({"mensaje": "Error en el servidor", "status": "error"})
    
# Nueva ruta para obtener la lista de socios
@app.route('/usuarios', methods=['GET'])
def lista_usuarios():
    try:
        db = conectar_db()
        cursor = db.cursor(dictionary=True) # Importante: dictionary=True para que nos dé los nombres de columna
        
        cursor.execute("SELECT id, usuario FROM usuarios") # NO traemos el password por seguridad
        usuarios = cursor.fetchall() # fetchall() trae TODOS los registros, no solo uno
        
        cursor.close()
        db.close()
        
        return jsonify(usuarios) # Flask convierte la lista de Python a JSON automáticamente
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al obtener usuarios"})
    
# Ruta para obtener el catálogo de servicios
@app.route('/servicios', methods=['GET'])
def listar_servicios():
    try:
        db = conectar_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM servicios")
        servicios = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(servicios)
    except Exception as e:
        return jsonify({"mensaje": "Error al cargar servicios"})

# Eliminar un usuario por ID
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    try:
        db = conectar_db()
        cursor = db.cursor()
        
        sql = "DELETE FROM usuarios WHERE id = %s"
        cursor.execute(sql, (id,))
        db.commit()
        
        cursor.close()
        db.close()
        
        return jsonify({"mensaje": "Usuario eliminado", "status": "ok"})
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al eliminar usuario", "status": "error"})
    
@app.route('/inscribir', methods=['POST'])
def inscribir():
    datos = request.get_json()
    usuario_id = datos.get('usuario_id')
    servicio = datos.get('servicio')
    
    try:
        db = conectar_db()
        cursor = db.cursor()
        # Guardamos la inscripción
        cursor.execute("INSERT INTO inscripciones (usuario_id, servicio) VALUES (%s, %s)", (usuario_id, servicio))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"mensaje": "Inscripción exitosa", "status": "ok"})
    except Exception as e:
        return jsonify({"mensaje": f"Error: {e}", "status": "error"})
    
# Ruta para ver las inscripciones de un usuario específico
@app.route('/inscripciones/<int:usuario_id>', methods=['GET'])
def listar_inscripciones(usuario_id):
    try:
        db = conectar_db()
        cursor = db.cursor(dictionary=True)
        
        # Seleccionamos el nombre del servicio y la fecha
        # WHERE usuario_id = %s es el filtro clave
        cursor.execute("SELECT id, servicio, fecha FROM inscripciones WHERE usuario_id = %s", (usuario_id,))
        inscripciones = cursor.fetchall()
        
        cursor.close()
        db.close()
        
        return jsonify(inscripciones)
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"mensaje": "Error al obtener inscripciones"})


# Crear un nuevo servicio
@app.route('/servicios', methods=['POST'])
def crear_servicio():
    datos = request.get_json()
    nombre = datos.get('nombre')
    descripcion = datos.get('descripcion')
    imagen = datos.get('imagen')
    
    try:
        db = conectar_db()
        cursor = db.cursor()
        cursor.execute("INSERT INTO servicios (nombre, descripcion, imagen) VALUES (%s, %s, %s)", (nombre, descripcion, imagen))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"mensaje": "Servicio creado", "status": "ok"})
    except Exception as e:
        return jsonify({"mensaje": f"Error: {e}", "status": "error"})

# Eliminar un servicio
@app.route('/servicios/<int:id>', methods=['DELETE'])
def eliminar_servicio(id):
    try:
        db = conectar_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM servicios WHERE id = %s", (id,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"mensaje": "Servicio eliminado", "status": "ok"})
    except Exception as e:
        return jsonify({"mensaje": f"Error: {e}", "status": "error"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)