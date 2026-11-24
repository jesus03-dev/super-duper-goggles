// Laboratorio NAI: cada producto tiene un costo diferente.
// Capítulo 1: objeto document, propiedades, métodos y eventos.
// Capítulo 2: variables, arreglos, números, textos y operadores.

var usuario = "Estudiante NAI";
var presupuesto = 30;
var cuentaActiva = true;
var productos = ["NAI Chat", "NAI Code", "NAI Vision", "NAI API"];
var costos = [2, 3, 5, 4]; // Créditos por consulta, en el mismo orden.
var consultas = [2, 0, 0, 0]; // Consultas realizadas en cada producto.
var posicion = 0; // Producto seleccionado: NAI Chat.

function mostrar() {
    // Cada producto conserva su cantidad de consultas y su precio.
    var total = 0;
    var cantidadTotal = 0;
    for (var i = 0; i < productos.length; i++) {
        total = total + consultas[i] * costos[i];
        cantidadTotal = cantidadTotal + consultas[i];
    }

    var restantes = presupuesto - total;
    var costoActual = costos[posicion];
    var disponible = cuentaActiva && restantes >= costoActual;

    document.getElementById("producto").textContent = productos[posicion];
    document.getElementById("costo").textContent = costoActual;
    document.getElementById("consultas").textContent = consultas[posicion];
    document.getElementById("cantidadTotal").textContent = cantidadTotal;
    document.getElementById("total").textContent = total;
    document.getElementById("restantes").textContent = restantes;
    document.getElementById("promedio").textContent = costoActual;
    document.getElementById("barra").value = total;
    document.getElementById("estado").textContent = cuentaActiva ? "Activa" : "Pausada";
    document.getElementById("detalle").textContent =
        usuario + ": " + consultas[posicion] + " consultas en " + productos[posicion] + ".";

    document.getElementById("agregar").disabled = !disponible;
    document.getElementById("quitar").disabled = !cuentaActiva || consultas[posicion] === 0;
}

function agregarConsulta() {
    // No permite superar el presupuesto con el costo del producto elegido.
    var total = 0;
    for (var i = 0; i < productos.length; i++) {
        total = total + consultas[i] * costos[i];
    }

    if (cuentaActiva && presupuesto - total >= costos[posicion]) {
        consultas[posicion]++;
        mostrar();
        document.getElementById("mensaje").textContent =
            "Consulta añadida a " + productos[posicion] + " (" + costos[posicion] + " créditos).";
    }
}

function quitarConsulta() {
    if (cuentaActiva && consultas[posicion] > 0) {
        consultas[posicion]--;
        mostrar();
        document.getElementById("mensaje").textContent =
            "Se quitó una consulta de " + productos[posicion] + ".";
    }
}

function cambiarProducto() {
    posicion = Number(document.getElementById("productoElegido").value);
    mostrar();
    document.getElementById("mensaje").textContent =
        "Ahora estás probando " + productos[posicion] + ": " + costos[posicion] + " créditos por consulta.";
}

function cambiarCuenta() {
    cuentaActiva = document.getElementById("cuentaActiva").checked;
    mostrar();
    document.getElementById("mensaje").textContent =
        cuentaActiva ? "Cuenta activada." : "Cuenta pausada: las consultas están bloqueadas.";
}

function reiniciar() {
    consultas = [2, 0, 0, 0];
    posicion = 0;
    cuentaActiva = true;
    document.getElementById("productoElegido").value = "0";
    document.getElementById("cuentaActiva").checked = true;
    mostrar();
    document.getElementById("mensaje").textContent = "Prueba reiniciada correctamente.";
}

mostrar();