// Definición de la clase Monstruo
class Monstruo {
    constructor(nombre, puntosAtaque, puntosDefensa) {
        this.nombre = nombre;
        this.puntosAtaque = puntosAtaque;
        this.puntosDefensa = puntosDefensa;
        this.usado = false;// Indica si el monstruo ha sido utilizado en un turno
    }

    // Método para que un monstruo ataque a otro
    ataque(cartaMonstruo, jugadorAtacado) {
        if (this.puntosAtaque > 0 && !this.usado) {
            const dano = Math.min(this.puntosAtaque, cartaMonstruo.puntosDefensa);
            cartaMonstruo.puntosDefensa -= dano;
            this.puntosAtaque -= dano;
            this.usado = true;

            // Mensaje de ataque
            alert(`${this.nombre} ataca a ${cartaMonstruo.nombre} por ${dano} puntos.`);

            // Verifica si el monstruo objetivo ha sido derrotado
            if (cartaMonstruo.puntosDefensa <= 0) {
                jugadorAtacado.puntosVida -= this.puntosAtaque;
                alert(`${this.nombre} derrota a ${cartaMonstruo.nombre}. ${jugadorAtacado.nombre} pierde ${this.puntosAtaque} puntos de vida.`);
            }
        } else if (this.usado) {
            alert(`${this.nombre} ya fue utilizada en este juego.`);
        } else {
            alert(`${this.nombre} no puede atacar, ya que no tiene puntos de ataque.`);
        }
    }
}

//Definición de la clase Jugador
class Jugador {
    constructor(nombre) {
        this.nombre = nombre;
        this.monstruo = null;
        this.puntosVida = 100;
    }
}

// Función para obtener un monstruo aleatorio
function monstruoAleatorio(arrayMonstruo) {
    if (arrayMonstruo.length === 0) {
        console.log("El array de monstruos está vacío.");
        return null;
    }
    const index = Math.floor(Math.random() * arrayMonstruo.length);
    return arrayMonstruo[index];
}

// Función para elegir un monstruo, solicitando la entrada del usuario
function elegirMonstruo() {
    const eleccionMonstruoUsuario = prompt(`${jugador1.nombre} elegi un monstruo para pelear: 
    Osac
    Iron
    Chan
    Verto
    Guz
    Trist`);
    const eleccionMonstruo = monstruos.find(monstruo => monstruo.nombre.toLowerCase() === eleccionMonstruoUsuario.toLocaleLowerCase());

    // Verifica si el monstruo elegido es válido
    if (eleccionMonstruo) {
        return eleccionMonstruo;
    } else {
        alert("Monstruo no válido. Se seleccionará uno al azar.");
        return monstruoAleatorio(monstruos);
    }
}

// Arreglo de monstruos disponibles
let monstruos = [
    new Monstruo("Osac", 85, 20),
    new Monstruo("Iron", 90, 27),
    new Monstruo("Chan", 100, 25),
    new Monstruo("Verto", 75, 28),
    new Monstruo("Guz", 110, 40),
    new Monstruo("Trist", 95, 22)
];

// Creación de jugadores
let jugador1 = new Jugador(prompt("Ingrese su nombre"));
let jugador2 = new Jugador("Computadora");
let jugadorActual = jugador1;


// Función para cambiar el turno entre jugadores
function cambiarTurno() {
    jugadorActual = jugadorActual === jugador1 ? jugador2 : jugador1;
}

// Función para iniciar el juego
function inicioJuego() {
    while (jugador1.puntosVida > 0 && jugador2.puntosVida > 0) {
        jugador1.monstruo = elegirMonstruo();
        jugador2.monstruo = monstruoAleatorio(monstruos);
        jugadorActual.monstruo.ataque(jugadorActual === jugador1 ? jugador2.monstruo : jugador1.monstruo, jugadorActual === jugador1 ? jugador2 : jugador1);
        alert(`Estado actual: ${jugador1.nombre} - ${jugador1.puntosVida} HP | ${jugador2.nombre} - ${jugador2.puntosVida} HP`);
        cambiarTurno();
    }

    // Determina el ganador al final del juego
    if (jugador1.puntosVida <= 0) {
        alert(`${jugador2.nombre} gana`);
    } else {
        alert(`${jugador1.nombre} gana`);
    }

    // Pregunta si el jugador quiere jugar de nuevo
    const jugarDeNuevo = confirm('¿Quieren jugar otra vez?');
    if (jugarDeNuevo) {
        reinicioJuego();
        inicioJuego();
    } else {
        alert('Gracias por jugar. ¡Hasta luego!');
    }
}

// Función para reiniciar el juego
function reinicioJuego() {
    jugador1 = new Jugador(prompt("Ingrese su nombre"));
    jugador2 = new Jugador("Computadora");
    jugadorActual = jugador1;
}

// Inicia el juego por primera vez
inicioJuego();
