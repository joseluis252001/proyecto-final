/* ========================================
   main.js
   Controla el menú hamburguesa y modo oscuro
   ======================================== */

// Espera a que todo el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    // Botón para abrir/cerrar el menú
    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.querySelector("nav ul");

    // Evento para mostrar u ocultar el menú en móviles
    menuToggle.addEventListener("click", () => {
        navList.classList.toggle("activo");
    });

    // Botón para alternar modo claro/oscuro
    const themeToggle = document.getElementById("theme-toggle");

    // Verifica si el usuario ya tiene un tema guardado
    if (localStorage.getItem("tema") === "oscuro") {
        document.body.classList.add("oscuro");
    }

    // Evento para cambiar entre modo claro y oscuro
    themeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("oscuro")) {
            document.body.classList.remove("oscuro");
            localStorage.setItem("tema", "claro");
        } else {
            document.body.classList.add("oscuro");
            localStorage.setItem("tema", "oscuro");
        }
    });

    // Botón para volver arriba (scrollToTop)
    const scrollToTopBtn = document.getElementById("scrollToTop");

    // Mostrar botón cuando el usuario baja
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });

    // Volver arriba cuando se hace clic en el botón
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});