// NAI Vision Studio: carga, anota y descarga una imagen con Canvas.

var canvas = document.getElementById("canvasVision");
var contexto = canvas.getContext("2d");
var entradaImagen = document.getElementById("imagenEntrada");
var colorTrazo = document.getElementById("colorTrazo");
var grosorTrazo = document.getElementById("grosorTrazo");
var imagenOriginal = null;
var dibujando = false;

// Deja un fondo blanco inicial.
function prepararLienzo() {
    contexto.fillStyle = "#ffffff";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
}

prepararLienzo();

// Comprueba si el navegador permite leer archivos locales.
if (window.FileReader) {
    document.getElementById("estadoVision").textContent =
        "Lector de archivos disponible. Puedes seleccionar una imagen.";
} else {
    document.getElementById("estadoVision").textContent =
        "Este navegador no admite la lectura de imágenes locales.";
    entradaImagen.disabled = true;
}

// Lee la imagen seleccionada y la dibuja en el lienzo.
entradaImagen.addEventListener("change", function (evento) {
    var archivo = evento.target.files[0];

    if (!archivo) {
        return;
    }

    if (archivo.type.indexOf("image/") !== 0) {
        document.getElementById("estadoVision").textContent = "Selecciona un archivo de imagen.";
        entradaImagen.value = "";
        return;
    }

    if (archivo.size > 8 * 1024 * 1024) {
        document.getElementById("estadoVision").textContent = "La imagen supera el límite de 8 MB.";
        entradaImagen.value = "";
        return;
    }

    var lector = new FileReader();

    lector.onload = function (e) {
        var imagen = new Image();

        imagen.onload = function () {
            var escala = Math.min(1, 1000 / imagen.width, 600 / imagen.height);
            canvas.width = Math.round(imagen.width * escala);
            canvas.height = Math.round(imagen.height * escala);
            imagenOriginal = imagen;
            contexto.drawImage(imagen, 0, 0, canvas.width, canvas.height);
            document.getElementById("estadoVision").textContent =
                "Imagen cargada. Ahora puedes realizar anotaciones.";
        };

        imagen.onerror = function () {
            document.getElementById("estadoVision").textContent = "No se pudo abrir esa imagen.";
        };

        imagen.src = e.target.result;
    };

    lector.onerror = function () {
        document.getElementById("estadoVision").textContent = "No se pudo leer el archivo.";
    };

    lector.readAsDataURL(archivo);
});

// Convierte la posición del puntero a las coordenadas reales del Canvas.
function obtenerPunto(evento) {
    var rectangulo = canvas.getBoundingClientRect();
    return {
        x: (evento.clientX - rectangulo.left) * (canvas.width / rectangulo.width),
        y: (evento.clientY - rectangulo.top) * (canvas.height / rectangulo.height)
    };
}

// Comienza un trazo cuando el usuario presiona el lienzo.
canvas.addEventListener("pointerdown", function (evento) {
    dibujando = true;
    canvas.setPointerCapture(evento.pointerId);
    var punto = obtenerPunto(evento);
    contexto.beginPath();
    contexto.moveTo(punto.x, punto.y);
});

// Dibuja mientras el puntero se mueve.
canvas.addEventListener("pointermove", function (evento) {
    if (!dibujando) {
        return;
    }

    var punto = obtenerPunto(evento);
    contexto.lineTo(punto.x, punto.y);
    contexto.strokeStyle = colorTrazo.value;
    contexto.lineWidth = Number(grosorTrazo.value);
    contexto.lineCap = "round";
    contexto.lineJoin = "round";
    contexto.stroke();
});

// Finaliza el trazo.
canvas.addEventListener("pointerup", function () {
    dibujando = false;
});
canvas.addEventListener("pointercancel", function () {
    dibujando = false;
});
canvas.addEventListener("lostpointercapture", function () {
    dibujando = false;
});

// Actualiza el número que acompaña al control de grosor.
grosorTrazo.addEventListener("input", function () {
    document.getElementById("valorGrosor").textContent = grosorTrazo.value;
});

// Vuelve a mostrar la imagen original o limpia el lienzo.
document.getElementById("restaurarLienzo").addEventListener("click", function () {
    if (!window.confirm("¿Deseas quitar las anotaciones y restaurar el lienzo?")) {
        return;
    }

    contexto.clearRect(0, 0, canvas.width, canvas.height);
    if (imagenOriginal) {
        contexto.drawImage(imagenOriginal, 0, 0, canvas.width, canvas.height);
        document.getElementById("estadoVision").textContent = "Se restauró la imagen original.";
    } else {
        prepararLienzo();
        document.getElementById("estadoVision").textContent = "El lienzo está limpio y listo para dibujar.";
    }
});

// Descarga el contenido del Canvas como una imagen PNG.
document.getElementById("guardarImagen").addEventListener("click", function () {
    var enlace = document.createElement("a");
    enlace.download = "NAI-Vision-anotacion.png";
    enlace.href = canvas.toDataURL("image/png");
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    document.getElementById("estadoVision").textContent = "La imagen se descargó en formato PNG.";
});
