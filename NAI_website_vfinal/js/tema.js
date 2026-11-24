/* NAI: cambio entre modo claro y modo oscuro. */
(function () {
    var botonTema = document.getElementById("botonTema");
    var temaGuardado = "claro";

    // Recupero la preferencia guardada en este navegador.
    try {
        temaGuardado = localStorage.getItem("temaNAI") || "claro";
    } catch (error) {
        // Si el navegador bloquea el almacenamiento, el botón sigue funcionando.
    }

    // Aplico el tema guardado al abrir cualquier página de NAI.
    if (temaGuardado === "oscuro") {
        document.body.classList.add("tema-oscuro");
    }

    actualizarBoton();

    // Cambio el tema cuando el usuario presiona el botón.
    botonTema.addEventListener("click", function () {
        document.body.classList.toggle("tema-oscuro");

        var modoOscuro = document.body.classList.contains("tema-oscuro");

        if (modoOscuro) {
            botonTema.textContent = "☀️ Modo claro";
            botonTema.setAttribute("aria-pressed", "true");
        } else {
            botonTema.textContent = "🌙 Modo oscuro";
            botonTema.setAttribute("aria-pressed", "false");
        }

        // Guardo la elección para conservarla al cambiar de página.
        try {
            localStorage.setItem("temaNAI", modoOscuro ? "oscuro" : "claro");
        } catch (error) {
            // El tema seguirá activo en la página actual aunque no pueda guardarse.
        }
    });

    function actualizarBoton() {
        var modoOscuro = document.body.classList.contains("tema-oscuro");

        if (modoOscuro) {
            botonTema.textContent = "☀️ Modo claro";
            botonTema.setAttribute("aria-pressed", "true");
        } else {
            botonTema.textContent = "🌙 Modo oscuro";
            botonTema.setAttribute("aria-pressed", "false");
        }
    }
})();
