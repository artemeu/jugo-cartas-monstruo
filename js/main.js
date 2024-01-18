// Definición de la clase Monstruo
class Monstruo {
    constructor(nombre, puntosAtaque, puntosDefensa, imagen) {
        this.nombre = nombre;
        this.puntosAtaque = puntosAtaque;
        this.puntosDefensa = puntosDefensa;
        this.imagen = imagen;
        this.usado = false; // Indica si el monstruo ha sido utilizado en un turno
    }
    // Método para que un monstruo ataque a otro
    ataque(cartaMonstruo, jugadorAtacado) {
        const battleInfoElement = document.querySelector("#battle-info");
        // Hacer una copia de los objetos antes del ataque
        const monstruoAtacanteOriginal = { ...this };
        const cartaMonstruoOriginal = { ...cartaMonstruo };
        if (this.puntosAtaque > 0 && !this.usado) {
            const dano = Math.min(this.puntosAtaque, cartaMonstruo.puntosDefensa);
            cartaMonstruo.puntosDefensa -= dano;
            this.puntosAtaque -= dano;
            // Restar puntos de vida al jugador atacado
            jugadorAtacado.puntosVida -= this.puntosAtaque; // Resta los puntos de ataque restantes
            // Restaurar los objetos originales después del ataque
            Object.assign(this, monstruoAtacanteOriginal);
            Object.assign(cartaMonstruo, cartaMonstruoOriginal);
            // Mensaje de ataque en battle-info
            battleInfoElement.innerText = `${this.nombre} ataca a ${cartaMonstruo.nombre} infligiendo ${dano} puntos de daño.`;
            actualizarVidaEnDOM();
            // Verificar si alguno de los jugadores ha perdido el juego
            verificarFinDelJuego();
        } else if (this.usado) {
            // Mensaje si el monstruo ya fue utilizado
            battleInfoElement.innerText = `${this.nombre} ya fue utilizado en este juego.`;
        } else {
            // Mensaje si el monstruo no puede atacar
            battleInfoElement.innerText = `${this.nombre} no puede atacar, ya que no tiene puntos de ataque.`;
        }
    }
    // Método para reiniciar el estado utilizado del monstruo y remover la clase "used" de la carta
    reiniciarYRemoverClase() {
        this.usado = false;
        const todasLasCartas = document.querySelectorAll(".monster-card");
        todasLasCartas.forEach(carta => carta.classList.remove("used"));
    }
    // Método para reiniciar el estado utilizado del monstruo
    reiniciar() {
        this.usado = false;
    }
};

// Definición de la clase Jugador
class Jugador {
    constructor(nombre) {
        this.nombre = nombre;
        this.monstruo = null;
        this.puntosVida = 100;
    }
};

// Creación de jugadores
let jugador1 = new Jugador(""); // El nombre se asignará más tarde
let jugador2 = new Jugador("Computadora");
let jugadorActual = jugador1;
let turnoJugadorAntesDeSalir = true;

// Arreglo de monstruos disponibles
let monstruos = [
    new Monstruo("Osac", 85, 20, "../img/Osac.jfif"),
    new Monstruo("Iron", 90, 27, "../img/Iron.jfif"),
    new Monstruo("Chan", 100, 25, "../img/Chan.jfif"),
    new Monstruo("Verto", 75, 28, "../img/Verto.jfif"),
    new Monstruo("Guz", 110, 40, "../img/Guz.jfif"),
    new Monstruo("Trist", 95, 22, "../img/Trist.jfif"),
    new Monstruo("Hydra", 120, 35, "../img/Hydra.jfif"),
    new Monstruo("Flareon", 80, 30, "../img/Flareon.jfif"),
    new Monstruo("Jich", 105, 32, "../img/Jich.jfif"),
    new Monstruo("Kank", 95, 25, "../img/Kank.jfif"),
    new Monstruo("Spritz", 115, 38, "../img/Spritz.jfif"),
    new Monstruo("Kanto", 100, 30, "../img/Kanto.jfif"),
    new Monstruo("Arnond", 125, 45, "../img/Arnond.jfif"),
    new Monstruo("Chinjo", 110, 35, "../img/Chinjo.jfif"),
    new Monstruo("Transion", 105, 45, "../img/Transion.jfif")
];

// Evento de clic al botón "Reiniciar Juego"
document.querySelector("#restart-btn").addEventListener("click", reinicioJuego);

// Evento de clic al botón "Atacar"
document.querySelector("#attack-btn").addEventListener("click", function () {
    inicioJuego();
});

// Evento de clic al botón "Siguiente Turno"
document.querySelector("#next-turn-btn").addEventListener("click", function () {
    // Agregar la validación para asegurarse de que el jugador1 haya seleccionado una carta
    const cartaSeleccionada = document.querySelector(".monster-card.selected");
    if (!cartaSeleccionada) {
        mostrarMensaje("Por favor, selecciona un monstruo antes de continuar.");
        return;
    }
    // Cambiar al siguiente turno
    siguienteTurno();
});

// Evento de clic al botón "Aceptar"
document.querySelector("#accept-btn").addEventListener("click", function () {
    // Obtener el nombre del jugador desde el input
    const playerName = document.querySelector("#player-name").value;
    // Verificar si se ingresó un nombre
    if (playerName.trim() !== "") {
        jugador1.nombre = playerName;
        actualizarVidaEnDOM();
        mostrarElementosIniciales();
        document.querySelector("#name-input-container").style.display = "none";
        document.querySelector("#monsters-container").style.display = "flex";
        document.querySelector("#attack-btn").style.display = "inline-block";
        cargarMonstruos();
        mostrarMensaje("");
        cargarEstadoJuego();
    } else {
        mostrarMensaje("Por favor, ingrese su nombre antes de comenzar el juego.");
    }
});

// event listener al documento para capturar clics en cualquier parte de la página
document.addEventListener("click", function (event) {
    // Verifica si el clic no fue dentro de ninguna carta de monstruo
    const todasLasCartas = document.querySelectorAll(".monster-card");
    let clicEnCarta = false;
    todasLasCartas.forEach(carta => {
        if (carta.contains(event.target)) {
            clicEnCarta = true;
        }
    });
    // Desselecciona la carta si no se hizo clic en ninguna carta de monstruo
    if (!clicEnCarta) {
        desseleccionarCarta();
    }
});

// Función para asignar el monstruo elegido a la computadora
function asignarMonstruoComputadora(computerMonster) {
    jugador2.monstruo = computerMonster;
    console.log(`Monstruo asignado a la computadora: ${computerMonster.nombre}`);
};

// Función para mostrar el mensaje de inicio del turno del jugador actual
function mostrarMensajeInicioTurno() {
    const battleInfoElement = document.querySelector("#battle-info");
    battleInfoElement.innerText = `Turno de ${jugador1.nombre} - ${jugador1.monstruo.nombre}`;
    battleInfoElement.innerText += `\n${jugador1.nombre} ha elegido a ${jugador1.monstruo.nombre}. ¡Listo para la batalla!`;
};

// Función para ocultar el contenedor del nombre y mostrar el contenedor de monstruos
function ocultarInputInicio() {
    document.querySelector("#name-input-container").style.display = "none";
    document.querySelector("#monsters-container").style.display = "flex";
};

// Función para mostrar un mensaje si no hay monstruos disponibles para la computadora
function monstruoNoDisponible() {
    const battleInfoElement = document.querySelector("#computer-monster-info");
    document.querySelector("#battle-info").innerText = "No hay monstruos disponibles para la computadora.";
};

// Función para obtener un monstruo aleatorio
const monstruoAleatorio = (arrayMonstruo) => {
    if (!arrayMonstruo.length) {
        console.log("El array de monstruos está vacío.");
        return null;
    }
    const index = Math.floor(Math.random() * arrayMonstruo.length);
    return arrayMonstruo[index];
};

// Función para mostrar mensajes en el elemento battle-info
function mostrarMensaje(mensaje) {
    const battleInfoElement = document.querySelector("#battle-info");
    battleInfoElement.innerText = mensaje;
};

// Función para mostrar elementos ocultos al principio
function mostrarElementosIniciales() {
    document.getElementById('player1-life').style.display = 'inline-block';
    document.getElementById('player2-life').style.display = 'inline-block';
    document.getElementById('battle-info').style.display = 'block';
    document.getElementById('computer-monster-info').style.display = 'block';
};

// Función para ocultar elementos
function ocultarElementos() {
    document.getElementById('player1-life').style.display = 'none';
    document.getElementById('player2-life').style.display = 'none';
    document.getElementById('computer-monster-info').style.display = 'none';
    document.querySelector("#attack-btn").style.display = "none";
    document.querySelector("#next-turn-btn").style.display = "none";
    document.querySelector("#monsters-container").style.display = "none";
};

// Función para actualizar los elementos del DOM con el nombre del jugador1
function actualizarNombreJugador1() {
    document.getElementById('player1-life').innerText = `${jugador1.nombre} HP: ${jugador1.puntosVida}`;
};

// Función para mostrar el estado del monstruo de la computadora
function mostrarEstadoComputadora(computerMonster) {
    const computerMonsterInfo = document.querySelector("#computer-monster-info");
    computerMonsterInfo.innerText = `Monstruo de la Computadora - ${computerMonster.nombre}\n`;
    computerMonsterInfo.innerText += `Puntos de Ataque: ${computerMonster.puntosAtaque}\n`;
    computerMonsterInfo.innerText += `Puntos de Defensa: ${computerMonster.puntosDefensa}\n`;
};

// Después de una batalla exitosa, actualiza la vida de los jugadores en el DOM
function actualizarVidaEnDOM() {
    document.getElementById('player2-life').innerText = `Computadora HP: ${jugador2.puntosVida}`;
    actualizarNombreJugador1();
};

// Función para seleccionar un monstruo aleatorio para la computadora
function seleccionAleatoria() {
    const availableMonsters = monstruos.filter(monstruo => !monstruo.usado);
    if (availableMonsters.length === 0) {
        console.log("No hay monstruos disponibles para la computadora.");
        return null;
    }
    const computerMonster = monstruoAleatorio(availableMonsters);
    return computerMonster;
};

// Función para elegir un monstruo, permitiendo seleccionar solo una carta a la vez
function elegirMonstruo(cartaMonstruo) {
    const battleInfoElement = document.querySelector("#battle-info");  
    // Verifica si la carta ya ha sido utilizada por el jugador1
    if (cartaMonstruo.classList.contains("used")) {
        battleInfoElement.innerText = "Esta carta ya fue utilizada. Por favor, elige otra.";
        return;
    }
    // Desselecciona la carta previamente seleccionada (si hay alguna)
    const cartaSeleccionada = document.querySelector(".monster-card.selected");
    if (cartaSeleccionada) {
        cartaSeleccionada.classList.remove("selected");
    }
    const nombreMonstruo = cartaMonstruo.getAttribute("data-nombre");
    const monstruoElegido = monstruos.find(monstruo => monstruo.nombre === nombreMonstruo);
    if (monstruoElegido?.usado) {
        // Mensaje si el monstruo ya fue utilizado utilizando el operador de encadenamiento opcional
        battleInfoElement.innerText = `${monstruoElegido.nombre} ya fue utilizado en este juego.`;
    } else if (monstruoElegido) {
        // Asigna el monstruo elegido al jugador actual
        jugador1.monstruo = monstruoElegido;
        // Agrega la clase "selected" a la cartaMonstruo seleccionada
        cartaMonstruo.classList.add("selected");
        mostrarMensajeInicioTurno();
    } else {
        // Mensaje si el monstruo no es válido
        battleInfoElement.innerText = "Monstruo no válido o ya fue utilizado. Inténtalo de nuevo.";
    }
};

// Función para cargar los monstruos en el elemento div del DOM
function cargarMonstruos() {
    const monstersContainer = document.querySelector("#monsters-container");
    const monstruoHTML = monstruos.map(monstruo => `
        <div class="monster-card" data-nombre="${monstruo.nombre}" onclick="elegirMonstruo(this)">
            <h3 class="monster-info">${monstruo.nombre}</h3>
            <img src="${monstruo.imagen}" alt="${monstruo.nombre}" class="monster-image">
            <p class="monster-info">ATK: ${monstruo.puntosAtaque}</p>
            <p class="monster-info">DEF: ${monstruo.puntosDefensa}</p>
        </div>`
    );
    monstersContainer.innerHTML = monstruoHTML.join('');
};

// Función para cambiar el turno entre jugadores
function cambiarTurno() {
    console.log("Cambiando turno a:", jugadorActual.nombre);
    jugadorActual = (jugadorActual === jugador1) ? jugador2 : jugador1;
    console.log("Turno cambiado a:", jugadorActual.nombre);
};

// Función para iniciar el juego
function inicioJuego() {
    if (!jugador1.monstruo) {
        mostrarMensaje("Por favor, selecciona un monstruo antes de comenzar el juego.");
        return;
    }
    // Agregar la validación para asegurarse de que el jugador1 haya seleccionado una carta
    const cartaSeleccionada = document.querySelector(".monster-card.selected");
    if (!cartaSeleccionada) {
        mostrarMensaje("Por favor, selecciona un monstruo antes de continuar.");
        return;
    }
    const computerMonster = seleccionAleatoria();
    if (computerMonster) {
        asignarMonstruoComputadora(computerMonster);
        jugador1.monstruo.ataque(jugador2.monstruo, jugador2);
        // Restablecer el estado utilizado del monstruo del jugador1
        jugador1.monstruo.reiniciar();
        // Añadir la clase "used" a la carta del monstruo del jugador1
        document.querySelector(`[data-nombre="${jugador1.monstruo.nombre}"]`).classList.add("used");
        actualizarVidaEnDOM();
        mostrarEstadoComputadora(computerMonster);
        cambiarTurno();
        // Oculta el botón de ataque y muestra el botón de siguiente turno
        document.querySelector("#attack-btn").style.display = "none";
        document.querySelector("#next-turn-btn").style.display = "inline-block";
        // Oculta el contenedor del nombre y muestra el contenedor de monstruos
        ocultarInputInicio();
        // Llama a verificarFinDelJuego después de realizar las acciones del turno
        verificarFinDelJuego();
        turnoJugadorAntesDeSalir = false;
        guardarEstadoJuego();
    } else {
        console.log("No hay monstruos disponibles para la computadora.");
        monstruoNoDisponible();
    }
};

// Función para el turno de la Computadora
function turnoComputadora() {
    const computerMonster = seleccionAleatoria();
    if (computerMonster) {
        console.log(`Monstruo seleccionado para la computadora: ${computerMonster.nombre}`);
        asignarMonstruoComputadora(computerMonster);
        jugador2.monstruo.ataque(jugador1.monstruo, jugador1);
        actualizarVidaEnDOM();
        mostrarEstadoComputadora(computerMonster);
        cambiarTurno();
        turnoJugadorAntesDeSalir = true;
        // Oculta el botón de ataque y muestra el botón de siguiente turno
        document.querySelector("#attack-btn").style.display = "inline-block";
        document.querySelector("#next-turn-btn").style.display = "none";
        // Oculta el contenedor del nombre y muestra el contenedor de monstruos
        ocultarInputInicio();
        verificarFinDelJuego();
        guardarEstadoJuego();
    } else {
        console.log("No hay monstruos disponibles para la computadora.");
        monstruoNoDisponible();
    }
};

// Función para cambiar al siguiente turno (jugador o computadora)
function siguienteTurno() {
    // Verificar si el jugador1 seleccionó un monstruo antes de continuar
    if (jugadorActual === jugador1 && !jugador1.monstruo) {
        mostrarMensaje("Por favor, selecciona un monstruo antes de continuar.");
        return;
    }
    // Después de seleccionar, desactivamos el clic en la carta y agregamos la clase "used"
    const selectedCard = document.querySelector(".monster-card.selected");
    if (selectedCard) {
        selectedCard.onclick = null;
        selectedCard.classList.add("used");
    }
    // Continuar con el resto de la lógica del turno
    turnoComputadora();
};

// Función para reiniciar el juego
function reinicioJuego() {
    localStorage.clear();
    reiniciarEstadoMonstruos();
    reiniciarContadoresVida();
    desseleccionarCarta();
    // Reinicia y remueve la clase "used" de las cartas de monstruos
    monstruos.forEach(monstruo => {
        monstruo.reiniciar();
        monstruo.reiniciarYRemoverClase();
    });
    jugador1.monstruo.reiniciar();
    jugador2.monstruo.reiniciar();
    // Actualiza la vista de vida en el DOM
    actualizarVidaEnDOM();
    // Vuelve a cargar los monstruos en el contenedor
    cargarMonstruos();
    // Oculta el botón de reiniciar y muestra el botón de ataque
    document.querySelector("#attack-btn").style.display = "inline-block";
    document.querySelector("#next-turn-btn").style.display = "none";
    // Oculta el contenedor del nombre y muestra el contenedor de monstruos
    ocultarInputInicio();
    // Limpia cualquier mensaje en el contenedor de información de batalla
    mostrarMensaje("");
    // Oculta los botones de reiniciar y salir
    document.querySelector("#restart-btn").style.display = "none";
    document.querySelector("#exit-btn").style.display = "none";
    mostrarElementosIniciales();
};

// Función para reiniciar el estado de todos los monstruos
function reiniciarEstadoMonstruos() {
    monstruos.forEach(monstruo => monstruo.reiniciar());
};

// Función para reiniciar los contadores de vida de los jugadores
function reiniciarContadoresVida() {
    jugador1.puntosVida = 100;
    jugador2.puntosVida = 100;
};

// Función para desseleccionar la carta del jugador1
function desseleccionarCarta() {
    const selectedCard = document.querySelector(".monster-card.selected");
    if (selectedCard) {
        selectedCard.classList.remove("selected");
    }
};

// funcion para determinar quien gano
function determinarGanador() {
    if (jugador1.puntosVida <= 0) {
        return `¡${jugador2.nombre} es el ganador/a!`;
    } else {
        return `¡${jugador1.nombre} es el ganador/a!`;
    }
};

// funcion para verificar el ganador
function verificarFinDelJuego() {
    const ganador = determinarGanador();
    if (jugador1.puntosVida <= 0 || jugador2.puntosVida <= 0) {
        const mensajeFinDelJuego = document.querySelector("#battle-info");
        const restartBtn = document.querySelector("#restart-btn");
        const exitBtn = document.querySelector("#exit-btn");
        restartBtn.style.display = "inline-block";
        exitBtn.style.display = "inline-block";
        ocultarElementos();
        mensajeFinDelJuego.innerText = `El juego ha terminado. ${ganador}\n Queres volver a jugar?`;
        // Limpia cualquier mensaje en el contenedor de información del monstruo de la computadora
        document.querySelector("#computer-monster-info").innerText = "";
        // Limpia el contenido de la vida en el DOM
        document.getElementById('player1-life').innerText = "";
        document.getElementById('player2-life').innerText = "";
        restartBtn.addEventListener("click", reinicioJuego);
        exitBtn.addEventListener("click", function () {
            // Recargar la página para volver al estado inicial
            window.location.reload();
            localStorage.clear();
        });
    }
};

// Guardar información en el LocalStorage
function guardarEstadoJuego() {
    const estadoJuego = {
        jugador1: {
            nombre: jugador1.nombre,
            puntosVida: jugador1.puntosVida,
            monstruo: jugador1.monstruo,
        },
        jugador2: {
            nombre: jugador2.nombre,
            puntosVida: jugador2.puntosVida,
            monstruo: jugador2.monstruo,
        },
        cartasUsadas: obtenerCartasUsadas(),
        turnoJugador: turnoJugadorAntesDeSalir,
    };
    // Utilizar el nombre del jugador como clave en el LocalStorage
    localStorage.setItem(`estadoJuego_${jugador1.nombre}`, JSON.stringify(estadoJuego));
};

// Función para obtener las cartas que han sido marcadas como "used"
function obtenerCartasUsadas() {
    const cartasUsadas = [];
    const todasLasCartas = document.querySelectorAll(".monster-card");
    todasLasCartas.forEach(carta => {
        const nombre = carta.getAttribute("data-nombre");
        const usado = carta.classList.contains("used");
        cartasUsadas.push({ nombre, usado });
    });
    return cartasUsadas;
};

// Recuperar información del LocalStorage al cargar la página
function cargarEstadoJuego() {
    const estadoGuardado = localStorage.getItem(`estadoJuego_${jugador1.nombre}`);
    if (estadoGuardado) {
        const estadoJuego = JSON.parse(estadoGuardado);
        jugadorActual = (estadoJuego.turnoActual === jugador1.nombre) ? jugador1 : jugador2;
        // Restaurar el estado de las cartas usadas
        estadoJuego.cartasUsadas.forEach(carta => {
            const cartaMonstruo = document.querySelector(`[data-nombre="${carta.nombre}"]`);
            if (cartaMonstruo) {
                if (carta.usado) {
                    cartaMonstruo.classList.add("used");
                }
            }
        });
        // Restaurar el estado de los jugadores y monstruos
        jugador1.nombre = estadoJuego.jugador1.nombre;
        jugador1.puntosVida = estadoJuego.jugador1.puntosVida;
        jugador1.monstruo = estadoJuego.jugador1.monstruo;
        jugador2.nombre = estadoJuego.jugador2.nombre;
        jugador2.puntosVida = estadoJuego.jugador2.puntosVida;
        jugador2.monstruo = estadoJuego.jugador2.monstruo;
        // Restaurar el estado del turno del jugador antes de salir
        turnoJugadorAntesDeSalir = estadoJuego.turnoJugador;
        // Si es el turno del jugador, oculta el botón de siguiente turno y muestra el de ataque
        if (turnoJugadorAntesDeSalir) {
            document.querySelector("#next-turn-btn").style.display = "none";
            document.querySelector("#attack-btn").style.display = "inline-block";
        } else {
            // Si es el turno de la computadora, oculta el botón de ataque y muestra el de siguiente turno
            document.querySelector("#attack-btn").style.display = "none";
            document.querySelector("#next-turn-btn").style.display = "inline-block";
        }
        // Actualizar la vista de vida en el DOM
        actualizarVidaEnDOM();
    }
};
