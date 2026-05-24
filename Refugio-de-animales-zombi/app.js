// ==========================================
// 🛠️ 1. DEFINICIÓN DE LA CLASE ANIMAL
// ==========================================
class Animal {
    constructor(id, nombre, especie, icono) {
        this.id = id;
        this.nombre = nombre;
        this.especie = especie;
        this.icono = icono;
        this.salud = 100;      
        this.energia = 100;    
        this.estado = "En Refugio"; 
    }

    desgasteDiario() {
        this.energia -= 15;
        if (this.energia <= 0) {
            this.energia = 0;
            this.salud -= 20; 
        }
        if (this.salud <= 0) this.salud = 0;
    }

    alimentar() {
        if (this.salud > 0) {
            this.salud = Math.min(100, this.salud + 15);
            this.energia = Math.min(100, this.energia + 10);
            return true;
        }
        return false;
    }

    hidratar() {
        if (this.salud > 0) {
            this.energia = Math.min(100, this.energia + 25);
            return true;
        }
        return false;
    }
}

// ==========================================
// 📊 2. ESTADO GLOBAL Y DATOS INICIALES
// ==========================================
const refugio = {
    dia: 1,
    comida: 50,
    agua: 50,
    alerta: "BAJA"
};

const listaAnimales = [
    new Animal(1, "Max", "Pastor Alemán", "🐕"),
    new Animal(2, "Bigotes", "Gato Callejero", "🐈"),
    new Animal(3, "Simba", "León de Zoo", "🦁"),
    new Animal(4, "Coco", "Loro Inteligente", "🦜")
];

// ==========================================
// 🖥️ 3. CAPTURA DEL DOM (ELEMENTOS HTML)
// ==========================================
const domDias = document.getElementById("contador-dias");
const domComida = document.getElementById("recurso-comida");
const domAgua = document.getElementById("recurso-agua");
const domAlerta = document.getElementById("nivel-alerta");
const domContenedor = document.getElementById("contenedor-animales");
const domSelectAnimal = document.getElementById("select-animal-mision");
const domFormMision = document.getElementById("formulario-mision");
const domLog = document.getElementById("log-sucesos");
const domBtnPasarDia = document.getElementById("btn-pasar-dia");

// ==========================================
// 🎨 4. FUNCIONES DE RENDERIZADO
// ==========================================
function actualizarMarcadores() {
    domDias.textContent = refugio.dia;
    domComida.textContent = refugio.comida;
    domAgua.textContent = refugio.agua;
    domAlerta.textContent = refugio.alerta;
    domAlerta.className = refugio.alerta === "ALTA" ? "text-red-500 font-bold" : 
                          refugio.alerta === "MEDIA" ? "text-yellow-500 font-bold" : "text-green-500 font-bold";
}

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
    domLog.scrollTop = domLog.scrollHeight; 
}

function renderizarAnimales() {
    domContenedor.innerHTML = ""; 
    domSelectAnimal.innerHTML = '<option value="">-- Elige un animal --</option>'; 

    listaAnimales.forEach(animal => {
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

        if (estaVivo && animal.estado === "En Refugio") {
            const opcion = document.createElement("option");
            opcion.value = animal.id;
            opcion.textContent = `${animal.icono} ${animal.nombre}`;
            domSelectAnimal.appendChild(opcion);
        }
    });
}

// ==========================================
// 🎮 5. INTERACCIONES (BOTONES CUIDADOS)
// ==========================================
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

// ==========================================
// 🚀 6. MISIONES DE EXPLORACIÓN
// ==========================================
domFormMision.addEventListener("submit", function(evento) {
    evento.preventDefault(); 

    const idAnimal = parseInt(domSelectAnimal.value);
    const zona = document.getElementById("select-zona-mision").value;

    if (!idAnimal) {
        agregarLog("Debes seleccionar un animal válido para la misión.", "peligro");
        return;
    }

    const animal = listaAnimales.find(a => a.id === idAnimal);
    animal.estado = "Explorando";
    agregarLog(`🚀 ${animal.nombre} ha salido hacia el/la ${zona.toUpperCase()}...`, "evento");
    renderizarAnimales();

    setTimeout(() => {
        resolverMision(animal, zona);
    }, 5000);
});

function resolverMision(animal, zona) {
    if (animal.salud <= 0) return; 

    let comidaEncontrada = 0;
    let aguaEncontrada = 0;
    let dañoRecibido = 0;

    if (zona === "supermercado") {
        comidaEncontrada = Math.floor(Math.random() * 15) + 5;  
        aguaEncontrada = Math.floor(Math.random() * 10) + 5;    
        dañoRecibido = Math.floor(Math.random() * 10);          
    } else if (zona === "farmacia") {
        comidaEncontrada = Math.floor(Math.random() * 10) + 5;
        aguaEncontrada = Math.floor(Math.random() * 20) + 10;   
        dañoRecibido = Math.floor(Math.random() * 25) + 5;      
    } else if (zona === "base-militar") {
        comidaEncontrada = Math.floor(Math.random() * 40) + 20; 
        aguaEncontrada = Math.floor(Math.random() * 30) + 15;
        dañoRecibido = Math.floor(Math.random() * 50) + 20;     
    }

    refugio.comida += comidaEncontrada;
    refugio.agua += aguaEncontrada;
    animal.salud = Math.max(0, animal.salud - dañoRecibido);
    animal.energia = Math.max(0, animal.energia - 30);
    animal.estado = "En Refugio";

    if (animal.salud <= 0) {
        agregarLog(`💀 TRAGEDIA: ${animal.nombre} fue emboscado en la misión y no logró sobrevivir.`, "peligro");
    } else {
        agregarLog(`✅ ${animal.nombre} ha vuelto. Encontró: 🍖x${comidaEncontrada}, 💧x${aguaEncontrada}. Sufrió ${dañoRecibido} de daño.`, "exito");
    }

    actualizarMarcadores();
    renderizarAnimales();
}

// ==========================================
// ⌛ 7. CAMBIO DE DÍA Y ATAQUES ZOMBI
// ==========================================
domBtnPasarDia.addEventListener("click", pasarDeDia);

function pasarDeDia() {
    refugio.dia += 1;
    agregarLog(`=== AMANECE EL DÍA ${refugio.dia} ===`, "evento");

    listaAnimales.forEach(animal => {
        if (animal.salud > 0) {
            if (refugio.comida >= 1 && refugio.agua >= 1) {
                refugio.comida -= 1;
                refugio.agua -= 1;
                animal.desgasteDiario(); 
            } else {
                animal.salud = Math.max(0, animal.salud - 30);
                agregarLog(`⚠️ ${animal.nombre} está pasando hambre/sed por falta de suministros.`, "peligro");
            }
        }
    });

    simularEventoZombi();

    const alertas = ["BAJA", "MEDIA", "ALTA"];
    refugio.alerta = alertas[Math.floor(Math.random() * alertas.length)];

    actualizarMarcadores();
    renderizarAnimales();
}

function simularEventoZombi() {
    const probabilidadAtaque = Math.random();
    const umbral = refugio.alerta === "ALTA" ? 0.4 : 0.7;

    if (probabilidadAtaque > umbral) {
        agregarLog("🚨 ¡UNA HORDA ZOMBI ATACA LOS MUROS DEL REFUGIO!", "peligro");
        const animalesVivos = listaAnimales.filter(a => a.salud > 0 && a.estado === "En Refugio");
        
        if (animalesVivos.length > 0) {
            const defensor = animalesVivos[Math.floor(Math.random() * animalesVivos.length)];
            const dañoHorda = Math.floor(Math.random() * 30) + 10; 
            defensor.salud = Math.max(0, defensor.salud - dañoHorda);
            agregarLog(`🛡️ ${defensor.nombre} luchó en primera línea para defender el refugio y sufrió ${dañoHorda} de daño.`, "sistema");
            
            if (defensor.salud <= 0) {
                agregarLog(`💀 ${defensor.nombre} ha muerto defendiendo las puertas.`, "peligro");
            }
        } else {
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

// ==========================================
// 🏁 8. INICIALIZACIÓN
// ==========================================
function iniciarApp() {
    actualizarMarcadores();
    renderizarAnimales();
    agregarLog("Refugio operativo. Los zombis acechan afuera...", "sistema");
}

iniciarApp();