console.log("¡El sistema está activo!");
const formLogin = document.getElementById('form-login');
const seccionLogin = document.getElementById('acceso-club');
const seccionDashboard = document.getElementById('dashboard');
const spanNombre = document.getElementById('nombre-usuario');
const logOut = document.getElementById('btn-logout');
const seccionRegistro = document.getElementById('seccion-registro');
const btnIrARegistro = document.getElementById('btn-registro');
const btnVolverALogin = document.getElementById('btn-volver-login');
const formRegistro = document.getElementById('form-registro');
const btnNavLogin = document.getElementById('btn-nav-login');
const seccionServicios = document.getElementById('servicios');
const navInicio = document.getElementById('nav-inicio');
const navServicios = document.getElementById('nav-servicios');
const navContacto = document.getElementById('nav-contacto');
const seccionContacto = document.getElementById('contacto');
let usuarioId = null; // Aquí guardaremos el ID del usuario conectado
let usuarioRol = null; // Aquí guardaremos el rol del usuario conectado
const panelAdmin = document.getElementById('panel-admin');
const panelSocio = document.getElementById('panel-socio');
const tablaInscripcionesBody = document.getElementById('tabla-inscripciones-body');
// Elementos del menú inteligente
const liIngresar = document.getElementById('li-ingresar');
const liPanel = document.getElementById('li-panel');
const btnNavPanel = document.getElementById('btn-nav-panel');
const tablaServiciosAdmin = document.getElementById('tabla-servicios-admin');

formLogin.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto  
    
    console.log("¡Formulario enviado sin recargar!");
    
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    console.log("Enviando Datos a Python");

    // Aqui uso fetch para enviar los datos al servidor Python
    fetch('https://nelsonadgo.pythonanywhere.com/login', {
        method: 'POST', // indicamos que vamos a enviar Datos
        headers: {
            'Content-Type': 'application/json' // Avisamos que enviamos formato JSON
        },
        body: JSON.stringify({ // Empaquetamos los datos en una "caja" JSON
            usuario: usuario,
            password: password
        })
    })
    .then(response => response.json()) // Convertimos la respuesta de Python a JSON
    .then(data => {
        console.log("¡Respuesta recibida de Python!", data);
        
        // Si Python nos dice "ok", podríamos redirigir al usuario aquí
        if(data.status === 'ok') {
            alert("¡Login exitoso!");
            usuarioId = data.id; // Guardamos el ID del usuario conectado
            console.log("ID guardado en memoria:", usuarioId);
            usuarioRol = data.rol; // Guardamos el rol del usuario conectado
            console.log("Rol guardado en memoria:", usuarioRol);
            
            // 1. Ocultamos la seccion de login
            // 2. Mostramos el dashboard
            //seccionLogin.style.display = 'none';
            //seccionDashboard.style.display = 'block';
            //##### aca ###
            // ACTUALIZAMOS EL MENÚ:
            liIngresar.style.display = 'none'; // Ocultamos "Ingresar"
            liPanel.style.display = 'block';   // Mostramos "Mi Panel"
            // 1. Ocultamos el Login
            seccionLogin.style.display = 'none';
            seccionRegistro.style.display = 'none'; // Por si acaso

            // 2. Mostramos la pantalla de Inicio (Servicios)
            seccionServicios.style.display = 'grid'; // Usamos 'grid' por las tarjetas
            seccionContacto.style.display = 'block';
            
            // 3. Opcional: Limpiamos el formulario para que no quede escrito
            document.getElementById('usuario').value = '';
            document.getElementById('password').value = '';
            
            alert("¡Bienvenido/a " + data.usuario + "!");
            //spanNombre.textContent = data.usuario;

            // 3. Mostramos/Ocultamos paneles según rol
            if (usuarioRol === 'admin') {
                panelAdmin.style.display = 'block';
                panelSocio.style.display = 'none';
                cargarUsuarios(); // Cargamos la lista de usuarios
                cargarServiciosAdmin(); // Cargamos los servicios en el panel admin
            } else {
                panelAdmin.style.display = 'none';
                panelSocio.style.display = 'block';
                cargarInscripciones(); // Cargamos las inscripciones del socio
            }
        }
    
    })
    .catch(error => {
        console.error("Hubo un error:", error);
    });
});

logOut.addEventListener('click', function() {
    console.log("Click Detectado en el Boton");
    // 1. Ocultamos el dashboard
    seccionDashboard.style.display = 'none';
    
    // 2. Mostramos el login de nuevo
    seccionLogin.style.display = 'block';
    
    // 3. Limpiamos el nombre
    spanNombre.textContent = '';

    // RESTAURAMOS EL MENÚ:
    liIngresar.style.display = 'block'; // Vuelve el botón de Ingresar
    liPanel.style.display = 'none';     // Se va "Mi Panel"
});

btnIrARegistro.addEventListener('click', function() {
    console.log("Click Detectado en el Boton de Registro");
    // Ocultamos la seccion de login
    seccionLogin.style.display = 'none';
    
    // Mostramos la seccion de registro
    seccionRegistro.style.display = 'block';
});

formRegistro.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto
    console.log("¡Formulario de registro enviado sin recargar!");
    
    const nuevoUsuario = document.getElementById('nuevo-usuario').value;
    const nuevoPassword = document.getElementById('nuevo-password').value;
    console.log("Enviando Datos de Registro a Python");

    // Aqui uso fetch para enviar los datos al servidor Python
    fetch('https://nelsonadgo.pythonanywhere.com/registro', {
        method: 'POST', // indicamos que vamos a enviar Datos
        headers: {
            'Content-Type': 'application/json' // Avisamos que enviamos formato JSON
        },
        body: JSON.stringify({ // Empaquetamos los datos en una "caja" JSON 
            usuario: nuevoUsuario,
            password: nuevoPassword
        })
    })
    .then(response => response.json()) // Convertimos la respuesta de Python a JSON
    .then(data => {
        console.log("¡Respuesta recibida de Python!", data);
        alert(data.mensaje);
        if(data.status === 'ok') {
            // Si el registro fue exitoso, volvemos al login
            seccionRegistro.style.display = 'none';
            seccionLogin.style.display = 'block';
        }
    })
    .catch(error => {
        console.error("Hubo un error:", error);
    });


});

btnVolverALogin.addEventListener('click', function() {
    console.log("Click Detectado en el Boton de Volver al Login");
    // Ocultamos la seccion de registro
    seccionRegistro.style.display = 'none';
    // Mostramos la seccion de login
    seccionLogin.style.display = 'block';
});

// Nueva funcionalidad para el botón de navegación al Login
btnNavLogin.addEventListener('click', function() {
    // Ocultamos los servicios
    seccionServicios.style.display = 'none';
    
    // Mostramos el Login
    seccionLogin.style.display = 'block';
    
    // Aseguramos que el registro esté oculto por si acaso
    seccionRegistro.style.display = 'none';
});

// Función para volver a la vista principal (Landing Page)
function mostrarLandingPage() {
    // 1. Ocultamos las pantallas de "App"
    seccionLogin.style.display = 'none';
    seccionRegistro.style.display = 'none';
    seccionDashboard.style.display = 'none';

    // 2. Mostramos las secciones de la Landing
    // IMPORTANTE: Servicios usa 'grid', no 'block'
    seccionServicios.style.display = 'grid'; 
    seccionContacto.style.display = 'block';

    
}

// --- CONFIGURACIÓN DE BOTONES DEL NAV ---

// 1. Botón INICIO
navInicio.addEventListener('click', function(e) {
    e.preventDefault(); // Evita que recargue o salte bruscamente
    mostrarLandingPage();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube suavemente al tope
});

// 2. Botón SERVICIOS
navServicios.addEventListener('click', function(e) {
    mostrarLandingPage();
    // No necesitamos preventDefault aquí porque queremos que el href="#servicios" funcione y nos lleve ahí
});

// 3. Botón CONTACTO
navContacto.addEventListener('click', function(e) {
    mostrarLandingPage();
    // Dejamos que el href="#contacto" haga el scroll automático
});

// --- LÓGICA DEL DASHBOARD (TABLA DE USUARIOS) ---

const tablaUsuariosBody = document.getElementById('tabla-usuarios-body');
const btnCargarUsuarios = document.getElementById('btn-cargar-usuarios');

function cargarUsuarios() {
    console.log("Solicitando lista de usuarios...");

    fetch('https://nelsonadgo.pythonanywhere.com/usuarios')
        .then(response => response.json())
        .then(data => {
            console.log("Usuarios recibidos:", data);
            
            // 1. Limpiamos la tabla para no duplicar si damos clic varias veces
            tablaUsuariosBody.innerHTML = '';

            // 2. Recorremos la lista de usuarios
            data.forEach(usuario => {
                
                // 1. Preparamos el botón: Solo si es ADMIN mostramos el botón rojo
                let botonEliminar = '';
                
                if (usuarioRol === 'admin') {
                    botonEliminar = `
                        <button onclick="eliminarUsuario(${usuario.id})" style="color:red; cursor:pointer;">
                            🗑️ Eliminar
                        </button>
                    `;
                }

                // 2. Creamos la fila usando la variable botonEliminar
                const fila = `
                    <tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.usuario}</td>
                        <td><span style="color: green;">Activo</span></td>
                        <td>${botonEliminar} </td>
                    </tr>
                `;
                
                tablaUsuariosBody.innerHTML += fila;
            });
        })
        .catch(error => console.error("Error al cargar usuarios:", error));
}

// Asignamos el evento al botón
btnCargarUsuarios.addEventListener('click', cargarUsuarios);

// Función para borrar un usuario
function eliminarUsuario(id) {
    // 1. Preguntamos para confirmar (Seguridad)
    if (!confirm(`¿Estás seguro de eliminar al socio con ID ${id}?`)) {
        return; // Si dice que no, cancelamos
    }

    console.log("Eliminando usuario ID:", id);

    // 2. Enviamos la orden DELETE a Python
    fetch(`https://nelsonadgo.pythonanywhere.com/usuarios/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            alert('Usuario eliminado correctamente');
            cargarUsuarios(); // Recargamos la tabla para ver que desapareció
        } else {
            alert('Error al eliminar: ' + data.mensaje);
        }
    })
    .catch(error => console.error('Error:', error));
}

function inscribirUsuario(servicio) {
    // 1. Verificamos si el usuario está logueado
    console.log("Intentando inscribir. ID actual del usuario:", usuarioId);
    console.log("Servicio seleccionado:", servicio);

    if (usuarioId === null) {
        alert("Debes iniciar sesión para inscribirte.");
        // Opcional: llevarlo al login automáticamente
        seccionServicios.style.display = 'none';
        seccionLogin.style.display = 'block';
        return;
    }

    // 2. Enviamos la inscripción
    if (confirm(`¿Quieres inscribirte en ${servicio}?`)) {
        fetch('https://nelsonadgo.pythonanywhere.com/inscribir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: usuarioId,
                servicio: servicio
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
        })
        .catch(error => console.error('Error:', error));
    }
}

function cargarInscripciones() {
    // Usamos la variable global usuarioId que guardamos al hacer login
    fetch(`https://nelsonadgo.pythonanywhere.com/inscripciones/${usuarioId}`)
        .then(response => response.json())
        .then(data => {
            tablaInscripcionesBody.innerHTML = ''; // Limpiamos tabla

            if (data.length === 0) {
                tablaInscripcionesBody.innerHTML = '<tr><td colspan="3">Aún no te has inscrito a nada.</td></tr>';
                return;
            }

            data.forEach(inscripcion => {
                const fila = `
                    <tr>
                        <td>${inscripcion.servicio}</td>
                        <td>${inscripcion.fecha}</td>
                        <td><span style="color: green;">Confirmada</span></td>
                    </tr>
                `;
                tablaInscripcionesBody.innerHTML += fila;
            });
        })
        .catch(error => console.error("Error:", error));
}

// Botón "Mi Panel" del menú
btnNavPanel.addEventListener('click', function() {
    // 1. Ocultamos la landing page
    seccionServicios.style.display = 'none';
    seccionContacto.style.display = 'none';
    seccionLogin.style.display = 'none';
    seccionRegistro.style.display = 'none';

    // 2. Mostramos el Dashboard principal
    seccionDashboard.style.display = 'block';

    // 3. Decidimos qué tabla mostrar (igual que en el login)
    if (usuarioRol === 'admin') {
        panelAdmin.style.display = 'block';
        panelSocio.style.display = 'none';
        cargarUsuarios();
    } else {
        panelAdmin.style.display = 'none';
        panelSocio.style.display = 'block';
        cargarInscripciones(); // Recargamos la lista por si se inscribió recién
    }
});

// Función para cargar servicios desde la Base de Datos
function cargarServicios() {
    fetch('https://nelsonadgo.pythonanywhere.com/servicios')
        .then(response => response.json())
        .then(data => {
            // Limpiamos el contenedor por si acaso
            seccionServicios.innerHTML = '';

            // Recorremos cada servicio que vino de la BD
            data.forEach(servicio => {
                const tarjetaHTML = `
                    <div class="tarjeta-servicio">
                        <h3>${servicio.nombre}</h3>
                        <p>${servicio.descripcion}</p>
                        <img src="${servicio.imagen}" alt="${servicio.nombre}">
                        <button class="btn-inscribir" onclick="inscribirUsuario('${servicio.nombre}')">
                            📝 Inscribirse
                        </button>
                    </div>
                `;
                
                // Agregamos la tarjeta al contenedor
                seccionServicios.innerHTML += tarjetaHTML;
            });
        })
        .catch(error => console.error("Error al cargar servicios:", error));
}

// ¡IMPORTANTE! Ejecutamos la función apenas carga la página
cargarServicios();

// --- GESTIÓN DE SERVICIOS (ADMIN) ---

// 1. Cargar la tabla de gestión (similar a cargarServicios pero con botón borrar)
function cargarServiciosAdmin() {
    fetch('https://nelsonadgo.pythonanywhere.com/servicios')
        .then(response => response.json())
        .then(data => {
            tablaServiciosAdmin.innerHTML = '';
            data.forEach(servicio => {
                const fila = `
                    <tr>
                        <td>${servicio.nombre}</td>
                        <td>${servicio.descripcion}</td>
                        <td>
                            <button onclick="eliminarServicio(${servicio.id})" style="color:red; cursor:pointer;">🗑️ Borrar</button>
                        </td>
                    </tr>
                `;
                tablaServiciosAdmin.innerHTML += fila;
            });
        });
}

// 2. Crear nuevo servicio
function crearServicio() {
    const nombre = document.getElementById('nombre-servicio').value;
    const desc = document.getElementById('desc-servicio').value;
    const img = document.getElementById('img-servicio').value;

    if (!nombre || !desc || !img) {
        alert("Por favor completa todos los campos");
        return;
    }

    fetch('https://nelsonadgo.pythonanywhere.com/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, descripcion: desc, imagen: img })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        cargarServiciosAdmin(); // Recargar la tabla admin
        cargarServicios(); // Recargar la portada también
        
        // Limpiar inputs
        document.getElementById('nombre-servicio').value = '';
        document.getElementById('desc-servicio').value = '';
        document.getElementById('img-servicio').value = '';
    });
}

// 3. Eliminar servicio
function eliminarServicio(id) {
    if (confirm("¿Seguro que quieres borrar esta actividad?")) {
        fetch(`https://nelsonadgo.pythonanywhere.com/servicios/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            cargarServiciosAdmin();
            cargarServicios(); // Actualiza la portada
        });
    }
}