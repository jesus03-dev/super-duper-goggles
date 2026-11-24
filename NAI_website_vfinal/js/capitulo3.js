// NAI - Capítulo 3: funciones, métodos y objetos.

// Objeto literal: guarda información general de la empresa.
var empresaNAI = {
    nombre: "NAI",
    presupuesto: 30,
    mensaje: function () {
        return "Bienvenido al generador de propuestas de " + this.nombre + ".";
    }
};

// Arreglo de objetos: cada producto tiene sus propias propiedades.
var productos = [
    { nombre: "NAI Chat", creditos: 2, descripcion: "Asistente para conversar y resolver dudas." },
    { nombre: "NAI Code", creditos: 3, descripcion: "Herramienta de apoyo para programar." },
    { nombre: "NAI Vision", creditos: 5, descripcion: "Herramienta para analizar imágenes." },
    { nombre: "NAI API", creditos: 4, descripcion: "Servicio para integrar IA en otros proyectos." }
];

var solicitudActual = null;
var historialPropuestas = [];

// Función con parámetros y varios valores de retorno mediante un arreglo.
function calcularResumen(cantidad, costo, presupuesto) {
    var total = cantidad * costo;
    var restantes = presupuesto - total;
    var porcentaje = Math.round(total / presupuesto * 100);
    return [total, restantes, porcentaje];
}

// Expresión de función anónima: limpia el nombre y lo convierte a mayúsculas.
var formatearNombre = function (nombre) {
    var nombreLimpio = String(nombre).trim();
    return nombreLimpio.toUpperCase();
};

// Usa Math para crear un código de referencia aleatorio.
function crearCodigo() {
    var numero = Math.floor(Math.random() * 9000) + 1000;
    return "NAI-" + numero;
}

// Usa métodos del objeto Date para mostrar la fecha y la hora.
function formatearFecha(fecha) {
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();
    var hora = fecha.getHours();
    var minuto = fecha.getMinutes();

    if (minuto < 10) {
        minuto = "0" + minuto;
    }

    return dia + "/" + mes + "/" + anio + " - " + hora + ":" + minuto;
}

// Constructor: permite crear objetos de tipo Solicitud.
function Solicitud(cliente, producto, cantidad) {
    this.cliente = cliente;
    this.producto = producto;
    this.cantidad = cantidad;
    this.codigo = crearCodigo();
    this.fecha = new Date();
    this.estado = "Pendiente";

    var calculo = calcularResumen(cantidad, producto.creditos, empresaNAI.presupuesto);
    this.total = calculo[0];
    this.restantes = calculo[1];
    this.porcentaje = calculo[2];

    // Método del objeto. this se refiere a la solicitud creada.
    this.crearDescripcion = function () {
        return this.cliente + " solicitó " + this.cantidad + " consultas de " + this.producto.nombre + ".";
    };

    this.marcarRevisada = function () {
        this.estado = "Revisada";
    };
}

// Actualiza los detalles del producto seleccionado.
function actualizarProducto() {
    var posicion = Number(document.getElementById("productoElegido").value);
    var producto = productos[posicion];

    document.getElementById("detalleProducto").textContent =
        producto.nombre + ": " + producto.descripcion + " Costo: " + producto.creditos + " créditos por consulta.";
}

// Crea una solicitud nueva y valida los datos ingresados.
function generarPropuesta() {
    var nombreIngresado = document.getElementById("cliente").value;
    var cliente = formatearNombre(nombreIngresado);
    var posicion = Number(document.getElementById("productoElegido").value);
    var cantidad = Number(document.getElementById("cantidad").value);
    var producto = productos[posicion];

    if (cliente.length === 0) {
        document.getElementById("mensaje").textContent = "Escribe el nombre del cliente.";
        return;
    }

    if (cantidad < 1 || cantidad > 15 || cantidad % 1 !== 0) {
        document.getElementById("mensaje").textContent = "Ingresa una cantidad entera entre 1 y 15.";
        return;
    }

    if (cantidad * producto.creditos > empresaNAI.presupuesto) {
        document.getElementById("mensaje").textContent =
            "La solicitud supera el presupuesto de " + empresaNAI.presupuesto + " créditos.";
        return;
    }

    solicitudActual = new Solicitud(cliente, producto, cantidad);
    mostrarPropuesta();
    guardarEnHistorial();
    document.getElementById("mensaje").textContent = "Propuesta generada y guardada en este navegador.";
}

// Muestra los datos de la solicitud en el documento HTML.
function mostrarPropuesta() {
    if (solicitudActual === null) {
        return;
    }

    document.getElementById("codigo").textContent = solicitudActual.codigo;
    document.getElementById("nombreResumen").textContent = solicitudActual.cliente;
    document.getElementById("productoResumen").textContent = solicitudActual.producto.nombre;
    document.getElementById("cantidadResumen").textContent = solicitudActual.cantidad;
    document.getElementById("costoResumen").textContent = solicitudActual.producto.creditos;
    document.getElementById("totalResumen").textContent = solicitudActual.total.toFixed(0);
    document.getElementById("restantesResumen").textContent = solicitudActual.restantes;
    document.getElementById("porcentajeResumen").textContent = solicitudActual.porcentaje.toFixed(0) + "%";
    document.getElementById("fechaResumen").textContent = formatearFecha(solicitudActual.fecha);
    document.getElementById("estadoResumen").textContent = solicitudActual.estado;
    document.getElementById("prioridadResumen").textContent = solicitudActual.prioridad || "Normal";
    document.getElementById("descripcionResumen").textContent = solicitudActual.crearDescripcion();

    document.getElementById("revisar").disabled = false;
    document.getElementById("prioridad").disabled = false;
    document.getElementById("quitarPrioridad").disabled = !solicitudActual.prioridad;
}

// Actualiza una propiedad del objeto mediante su método.
function marcarRevisada() {
    if (solicitudActual !== null) {
        solicitudActual.marcarRevisada();
        mostrarPropuesta();
        actualizarHistorialActual();
        document.getElementById("mensaje").textContent = "La propuesta ahora está marcada como revisada.";
    }
}

// Añade una nueva propiedad al objeto.
function agregarPrioridad() {
    if (solicitudActual !== null) {
        solicitudActual.prioridad = "Alta";
        mostrarPropuesta();
        actualizarHistorialActual();
        document.getElementById("mensaje").textContent = "Se añadió la prioridad alta a la propuesta.";
    }
}

// Elimina una propiedad del objeto.
function quitarPrioridad() {
    if (solicitudActual !== null && solicitudActual.prioridad) {
        delete solicitudActual.prioridad;
        mostrarPropuesta();
        actualizarHistorialActual();
        document.getElementById("mensaje").textContent = "Se eliminó la prioridad de la propuesta.";
    }
}

// Restablece los campos y deja el resumen vacío.
function limpiarPropuesta() {
    solicitudActual = null;
    document.getElementById("cliente").value = "";
    document.getElementById("productoElegido").value = "0";
    document.getElementById("cantidad").value = "3";

    document.getElementById("codigo").textContent = "—";
    document.getElementById("nombreResumen").textContent = "Aún no generado";
    document.getElementById("productoResumen").textContent = "—";
    document.getElementById("cantidadResumen").textContent = "—";
    document.getElementById("costoResumen").textContent = "—";
    document.getElementById("totalResumen").textContent = "—";
    document.getElementById("restantesResumen").textContent = "—";
    document.getElementById("porcentajeResumen").textContent = "—";
    document.getElementById("fechaResumen").textContent = "—";
    document.getElementById("estadoResumen").textContent = "Sin propuesta";
    document.getElementById("prioridadResumen").textContent = "Normal";
    document.getElementById("descripcionResumen").textContent = "Aquí aparecerá el resumen de la solicitud.";

    document.getElementById("revisar").disabled = true;
    document.getElementById("prioridad").disabled = true;
    document.getElementById("quitarPrioridad").disabled = true;
    actualizarProducto();
    document.getElementById("mensaje").textContent = "Formulario limpio. Puedes crear otra propuesta.";
}


// Capítulo 14: guarda las últimas propuestas en el navegador.
function guardarEnHistorial() {
    var registro = {
        codigo: solicitudActual.codigo,
        cliente: solicitudActual.cliente,
        producto: solicitudActual.producto.nombre,
        cantidad: solicitudActual.cantidad,
        total: solicitudActual.total,
        fecha: formatearFecha(solicitudActual.fecha),
        estado: solicitudActual.estado,
        prioridad: solicitudActual.prioridad || "Normal"
    };

    historialPropuestas.unshift(registro);
    historialPropuestas = historialPropuestas.slice(0, 5);

    try {
        localStorage.setItem("naiHistorialPropuestas", JSON.stringify(historialPropuestas));
        document.getElementById("estadoHistorial").textContent =
            "Propuesta guardada. El historial se conserva en este navegador.";
    } catch (error) {
        document.getElementById("estadoHistorial").textContent =
            "No se pudo guardar en este navegador. La propuesta sigue visible en pantalla.";
    }

    mostrarHistorial();
}

// Carga el historial cuando se abre la página.
function cargarHistorial() {
    try {
        var datosGuardados = localStorage.getItem("naiHistorialPropuestas");
        if (datosGuardados) {
            var datos = JSON.parse(datosGuardados);
            if (Array.isArray(datos)) {
                historialPropuestas = datos;
            }
        }
        document.getElementById("estadoHistorial").textContent =
            historialPropuestas.length + " propuesta(s) guardada(s) en este navegador.";
    } catch (error) {
        historialPropuestas = [];
        document.getElementById("estadoHistorial").textContent =
            "El almacenamiento local no está disponible en este navegador.";
    }

    mostrarHistorial();
}

// Dibuja el historial usando elementos HTML creados desde JavaScript.
function mostrarHistorial() {
    var lista = document.getElementById("listaHistorial");
    if (!lista) {
        return;
    }

    lista.textContent = "";

    if (historialPropuestas.length === 0) {
        var vacio = document.createElement("li");
        vacio.textContent = "Aún no hay propuestas guardadas.";
        lista.appendChild(vacio);
        return;
    }

    for (var i = 0; i < historialPropuestas.length; i++) {
        var registro = historialPropuestas[i];
        var elemento = document.createElement("li");
        var titulo = document.createElement("strong");
        var detalle = document.createElement("p");

        titulo.textContent = registro.codigo + " · " + registro.cliente;
        detalle.textContent = registro.producto + " · " + registro.cantidad +
            " consulta(s) · " + registro.total + " créditos · " +
            registro.estado + " · Prioridad: " + registro.prioridad + " · " + registro.fecha;

        elemento.appendChild(titulo);
        elemento.appendChild(detalle);
        lista.appendChild(elemento);
    }
}

// Mantiene actualizado el registro cuando cambia el estado o la prioridad.
function actualizarHistorialActual() {
    for (var i = 0; i < historialPropuestas.length; i++) {
        if (historialPropuestas[i].codigo === solicitudActual.codigo) {
            historialPropuestas[i].estado = solicitudActual.estado;
            historialPropuestas[i].prioridad = solicitudActual.prioridad || "Normal";
            break;
        }
    }

    try {
        localStorage.setItem("naiHistorialPropuestas", JSON.stringify(historialPropuestas));
    } catch (error) {
        document.getElementById("estadoHistorial").textContent =
            "No se pudo actualizar el historial guardado.";
    }

    mostrarHistorial();
}

// Elimina el historial guardado en este navegador.
function eliminarHistorial() {
    if (!window.confirm("¿Deseas borrar el historial de propuestas de este navegador?")) {
        return;
    }

    historialPropuestas = [];
    try {
        localStorage.removeItem("naiHistorialPropuestas");
        document.getElementById("estadoHistorial").textContent = "Historial eliminado.";
    } catch (error) {
        document.getElementById("estadoHistorial").textContent =
            "No se pudo eliminar el historial local.";
    }

    mostrarHistorial();
}

// Propiedad del objeto window: muestra las dimensiones actuales del navegador.
var actualizarVentana = function () {
    document.getElementById("ventana").textContent =
        window.innerWidth + " × " + window.innerHeight + " píxeles";
};
window.onresize = actualizarVentana;

// IIFE: esta función se ejecuta inmediatamente para iniciar la página.
(function () {
    document.getElementById("mensajeBienvenida").textContent = empresaNAI.mensaje();
    document.getElementById("tituloDocumento").textContent = document.title;
    document.getElementById("numeroProductos").textContent = productos.length;
    actualizarProducto();
    actualizarVentana();
    cargarHistorial();
})();
