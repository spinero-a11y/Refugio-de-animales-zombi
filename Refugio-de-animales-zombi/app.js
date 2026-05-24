class Animal {
    constructor(id, nombre, especie, icono) {
        this.id = id;
        this.nombre = nombre;
        this.especie = especie;
        this.icono = icono;
        this.salud = 100;      // Máximo 100
        this.energia = 100;    // Máximo 100
        this.estado = "En Refugio"; // "En Refugio" o "Explorando"
    }

    // Método para simular el desgaste diario
    desgasteDiario() {
        this.energia -= 15;
        if (this.energia <= 0) {
            this.energia = 0;
            this.salud -= 20; // Si no tiene energía, empieza a perder salud
        }
        if (this.salud <= 0) this.salud = 0;
    }

    // Método para alimentar al animal
    alimentar() {
        if (this.salud > 0) {
            this.salud = Math.min(100, this.salud + 15);
            this.energia = Math.min(100, this.energia + 10);
            return true;
        }
        return false;
    }

    // Método para hidratar al animal
    hidratar() {
        if (this.salud > 0) {
            this.energia = Math.min(100, this.energia + 25);
            return true;
        }
        return false;
    }
}
// Estado del refugio
const refugio = {
    dia: 1,
    comida: 50,
    agua: 50,
    alerta: "BAJA"
};

// Nuestro "banco de datos" con instancias de la clase Animal
const listaAnimales = [
    new Animal(1, "Max", "Pastor Alemán", "🐕"),
    new Animal(2, "Bigotes", "Gato Callejero", "🐈"),
    new Animal(3, "Simba", "León de Zoo", "🦁"),
    new Animal(4, "Coco", "Loro Inteligente", "🦜")
];
const domDias = document.getElementById("contador-dias");
const domComida = document.getElementById("recurso-comida");
const domAgua = document.getElementById("recurso-agua");
const domAlerta = document.getElementById("nivel-alerta");
const domContenedor = document.getElementById("contenedor-animales");
const domSelectAnimal = document.getElementById("select-animal-mision");
const domFormMision = document.getElementById("formulario-mision");
const domLog = document.getElementById("log-sucesos");
const domBtnPasarDia = document.getElementById("btn-pasar-dia");
// Actualiza los marcadores superiores
function actualizarMarcadores() {
    domDias.textContent = refugio.dia;
    domComida.textContent = refugio.comida;
    domAgua.textContent = refugio.agua;
    domAlerta.textContent = refugio.alerta;
    
    // Cambiar color de la alerta según el nivel
    domAlerta.className = refugio.alerta === "ALTA" ? "text-red-500 font-bold" : 
                          refugio.alerta === "MEDIA" ? "text-yellow-500 font-bold" : "text-green-500 font-bold";
}

// Añade un mensaje a la consola inferior de la web
function agregarLog(mensaje, tipo = "sistema") {
    const colores = {
        sistema: "text-gray-400",
        exito: "text-green-400 font-semibold",
        peligro: "text-red-400 font-semibold",
        evento: "text-yellow-400"
    };
    const nuevoLog = document.createElement("p");
    nuevoLog.className = colores[tipo];
    nuevoLog.textContent = `[Día ${refugio.dia}] - ${mensaje}`;
    
    domLog.appendChild(nuevoLog);
    domLog.scrollTop = domLog.scrollHeight; // Auto-scroll hacia abajo
}

// Dibuja las tarjetas de los animales en el HTML
function renderizarAnimales() {
    domContenedor.innerHTML = ""; // Limpiamos el contenedor
    domSelectAnimal.innerHTML = '<option value="">-- Elige un animal --</option>'; // Limpiamos el select de misiones

    listaAnimales.forEach(animal => {
        // 1. Renderizar la tarjeta si el animal está vivo
        const estaVivo = animal.salud > 0;
        const colorTarjeta = estaVivo ? "bg-gray-800" : "bg-gray-950 opacity-50 border-red-900";
        
        let botonesHTML = '';
        if (estaVivo && animal.estado === "En Refugio") {
            botonesHTML = `
                <div class="flex gap-2 mt-4">
                    <button onclick="alimentarAnimal(${animal.id})" class="flex-1 bg-green-800 hover:bg-green-700 text-xs py-1.5 rounded font-medium transition">🍖 Alimentar</button>
                    <button onclick="hidratarAnimal(${animal.id})" class="flex-1 bg-cyan-800 hover:bg-cyan-700 text-xs py-1.5 rounded font-medium transition">💧 Hidratar</button>
                </div>`;
        } else if (!estaVivo) {
            botonesHTML = `<div class="text-center text-red-500 text-xs font-bold mt-4 uppercase">💀 Fallecido</div>`;
        } else {
            botonesHTML = `<div class="text-center text-yellow-500 text-xs font-bold mt-4 animate-pulse uppercase">🚀 Explorando...</div>`;
        }

        const tarjeta = `
            <div class="${colorTarjeta} p-4 rounded-lg border border-gray-700 shadow flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-lg font-bold ${estaVivo ? 'text-yellow-400' : 'text-gray-500'}">${animal.icono} ${animal.nombre} (${animal.especie})</h3>
                        <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${animal.estado === 'En Refugio' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}">
                            ${animal.estado}
                        </span>
                    </div>
                    <div class="space-y-1 text-sm text-gray-300">
                        <div>❤️ Salud: <span class="font-bold ${animal.salud > 50 ? 'text-green-400' : 'text-red-400'}">${animal.salud}/100</span></div>
                        <div>⚡ Energía: <span class="font-bold text-yellow-400">${animal.energia}/100</span></div>
                    </div>
                </div>
                ${botonesHTML}
            </div>
        `;
        domContenedor.innerHTML += tarjeta;

        // 2. Rellenar el selector de misiones solo si está vivo y en el refugio
        if (estaVivo && animal.estado === "En Refugio") {
            const opcion = document.createElement("option");
            opcion.value = animal.id;
            opcion.textContent = `${animal.icono} ${animal.nombre}`;
            domSelectAnimal.appendChild(opcion);
        }
    });
}
window.alimentarAnimal = function(id) {
    if (refugio.comida >= 1) {
        const animal = listaAnimales.find(a => a.id === id);
        if (animal.alimentar()) {
            refugio.comida -= 1;
            agregarLog(`Has alimentado a ${animal.nombre}. +15 Salud, +10 Energía.`, "sistema");
            actualizarMarcadores();
            renderizarAnimales();
        }
    } else {
        agregarLog("¡No tienes suficiente comida en el almacén!", "peligro");
    }
};

window.hidratarAnimal = function(id) {
    if (refugio.agua >= 1) {
        const animal = listaAnimales.find(a => a.id === id);
        if (animal.hidratar()) {
            refugio.agua -= 1;
            agregarLog(`Has dado de beber a ${animal.nombre}. +25 Energía.`, "sistema");
            actualizarMarcadores();
            renderizarAnimales();
        }
    } else {
        agregarLog("¡No tienes suficiente agua en el almacén!", "peligro");
    }
};
function iniciarApp() {
    actualizarMarcadores();
    renderizarAnimales();
    agregarLog("Refugio operativo. Los zombis acechan afuera...", "sistema");
}
domFormMision.addEventListener("submit", function(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    const idAnimal = parseInt(domSelectAnimal.value);
    const zona = document.getElementById("select-zona-mision").value;

    if (!idAnimal) {
        agregarLog("Debes seleccionar un animal válido para la misión.", "peligro");
        return;
    }

    const animal = listaAnimales.find(a => a.id === idAnimal);
    
    // Cambiamos el estado del animal para que no pueda hacer otra cosa
    animal.estado = "Explorando";
    agregarLog(`🚀 ${animal.nombre} ha salido hacia el/la ${zona.toUpperCase()}...`, "evento");
    renderizarAnimales();

    // Simulamos que la misión tarda 5 segundos en completarse (Asincronía)
    setTimeout(() => {
        resolverMision(animal, zona);
    }, 5000);
});

function resolverMision(animal, zona) {
    // Si el animal murió por un evento de cambio de día mientras exploraba
    if (animal.salud <= 0) return; 

    let comidaEncontrada = 0;
    let aguaEncontrada = 0;
    let dañoRecibido = 0;

    // Algoritmia básica de riesgo/recompensa basada en la zona
    if (zona === "supermercado") {
        comidaEncontrada = Math.floor(Math.random() * 15) + 5;  // 5 a 20
        aguaEncontrada = Math.floor(Math.random() * 10) + 5;    // 5 a 15
        dañoRecibido = Math.floor(Math.random() * 10);          // 0 a 10 (Poco daño)
    } else if (zona === "farmacia") {
        comidaEncontrada = Math.floor(Math.random() * 10) + 5;
        aguaEncontrada = Math.floor(Math.random() * 20) + 10;   // Más agua/medicinas
        dañoRecibido = Math.floor(Math.random() * 25) + 5;      // 5 a 30 (Riesgo medio)
    } else if (zona === "base-militar") {
        comidaEncontrada = Math.floor(Math.random() * 40) + 20; // Mucha comida
        aguaEncontrada = Math.floor(Math.random() * 30) + 15;
        dañoRecibido = Math.floor(Math.random() * 50) + 20;     // 20 a 70 (¡Muy peligroso!)
    }

    // Aplicamos los resultados al refugio y al animal
    refugio.comida += comidaEncontrada;
    refugio.agua += aguaEncontrada;
    animal.salud -= dañoRecibido;
    if (animal.salud < 0) animal.salud = 0;
    
    // El animal gasta energía por el viaje
    animal.energia = Math.max(0, animal.energia - 30);
    animal.estado = "En Refugio";

    // Mostramos los resultados en la consola (Log)
    if (animal.salud <= 0) {
        agregarLog(`💀 TRAGEDIA: ${animal.nombre} fue emboscado en la misión y no logró sobrevivir.`, "peligro");
    } else {
        agregarLog(`✅ ${animal.nombre} ha vuelto. Encontró: 🍖x${comidaEncontrada}, 💧x${aguaEncontrada}. Sufrió ${dañoRecibido} de daño.`, "exito");
    }

    // Volvemos a pintar todo con los nuevos datos
    actualizarMarcadores();
    renderizarAnimales();
}
domBtnPasarDia.addEventListener("click", pasarDeDia);

function pasarDeDia() {
    refugio.dia += 1;
    
    agregarLog(`=== AMANECE EL DÍA ${refugio.dia} ===`, "evento");

    // 1. Los animales consumen recursos y sufren desgaste diario
    listaAnimales.forEach(animal => {
        if (animal.salud > 0) {
            // Cada animal vivo consume 1 de comida y 1 de agua
            if (refugio.comida >= 1 && refugio.agua >= 1) {
                refugio.comida -= 1;
                refugio.agua -= 1;
                animal.desgasteDiario(); // Pierde energía
            } else {
                // Si no hay suministros, el animal pierde mucha salud directamente
                animal.salud = Math.max(0, animal.salud - 30);
                agregarLog(`⚠️ ${animal.nombre} está pasando hambre/sed por falta de suministros.`, "peligro");
            }
        }
    });

    // 2. Evento aleatorio: Ataque Zombi
    simularEventoZombi();

    // 3. Modificar el nivel de alerta de forma aleatoria para el día siguiente
    const alertas = ["BAJA", "MEDIA", "ALTA"];
    refugio.alerta = alertas[Math.floor(Math.random() * alertas.length)];

    // Actualizar la interfaz
    actualizarMarcadores();
    renderizarAnimales();
}

function simularEventoZombi() {
    const probabilidadAtaque = Math.random();
    
    // Si la alerta del día anterior era ALTA, hay más probabilidad de ataque
    const umbral = refugio.alerta === "ALTA" ? 0.4 : 0.7;

    if (probabilidadAtaque > umbral) {
        agregarLog("🚨 ¡UNA HORDA ZOMBI ATACA LOS MUROS DEL REFUGIO!", "peligro");
        
        // Elegimos un animal vivo al azar para que defienda el refugio
        const animalesVivos = listaAnimales.filter(a => a.salud > 0 && a.estado === "En Refugio");
        
        if (animalesVivos.length > 0) {
            const defensor = animalesVivos[Math.floor(Math.random() * animalesVivos.length)];
            const dañoHorda = Math.floor(Math.random() * 30) + 10; // 10 a 40 de daño
            
            defensor.salud = Math.max(0, defensor.salud - dañoHorda);
            
            agregarLog(`🛡️ ${defensor.nombre} luchó en primera línea para defender el refugio y sufrió ${dañoHorda} de daño.`, "sistema");
            
            if (defensor.salud <= 0) {
                agregarLog(`💀 ${defensor.nombre} ha muerto defendiendo las puertas.`, "peligro");
            }
        } else {
            // Si no quedan animales para defender, los zombis destruyen el almacén
            const perdidaComida = Math.min(refugio.comida, 15);
            const perdidaAgua = Math.min(refugio.agua, 15);
            refugio.comida -= perdidaComida;
            refugio.agua -= perdidaAgua;
            agregarLog(`🏚️ Sin defensores, los zombis saquearon el almacén. Perdiste 🍖x${perdidaComida} y 💧x${perdidaAgua}.`, "peligro");
        }
    } else {
        agregarLog("🪶 La noche ha sido tranquila. Ningún zombi se ha acercado.", "sistema");
    }
}
// Arrancar el juego
iniciarApp();