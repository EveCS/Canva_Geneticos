// Investigar open cv para pintar los puntos de coordenadas

//RangeInputs del html
const rangeInputs = document.querySelectorAll(".form-range");
const btnInicio = document.getElementById("initGen");

//Declarar variables informacion dada por el usuario
let maximaPoblacion, individuosPoblacion;
let individuosElegir, individuosMutar, individuosCombinar;

//Canvas tanto el de entrada como el de salida, crear la imagen
const context = canvas.getContext("2d");
const strokeWidthInput = document.getElementById("strokeWidth");
const canvasInput = document.getElementById('canvasInput');
const canvasOutput = document.getElementById('canvasOutput');
const image = new Image();

//Variables de cronometro y opencv
let isOpencvReady = false;
let cronometro;
let segundos = 0;
let tiempoGen = [];


let src, dst, contours, hierarchy;

function opencvcheck() {
    isOpencvReady = true;
    document.getElementById('checker').innerHTML = "Opencv is Ready."
}


function loadImage(event) {
    if (!isOpencvReady) {
        console.log("OpenCV.js is not ready yet.");
        return;
    }


    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {

        image.onload = function () {
            canvasInput.width = image.width;
            canvasInput.height = image.height;
            canvasOutput.width = image.width;
            canvasOutput.height = image.height;

            const ctxInput = canvasInput.getContext('2d');
            ctxInput.drawImage(image, 0, 0);

        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
}


//Tomar los range inputs y validar que entre los tres sumen el 100%
rangeInputs.forEach((input) => {
    input.addEventListener("input", updateRanges);
});

function updateRanges() {
    let total = 0;

    rangeInputs.forEach((input) => {
        total += parseInt(input.value);
    });

    if (total > 100) {
        const changedInput = this.id;
        const remainingValue = total - 100;

        rangeInputs.forEach((input) => {
            if (input.id !== changedInput) {
                const currentValue = parseInt(input.value);
                const newValue = currentValue - remainingValue / 2;

                input.value = newValue;
            }
        });
    }

    rangeInputs.forEach((input) => {
        const valueSpan = document.getElementById(input.id + "-value");
        valueSpan.textContent = input.value + "%";
    });
}

function fitness(dna, objetivo) {
    // Calcula la puntuación de fitness de un ADN basada en la cantidad de números de la lista objetivo que coinciden
    let puntaje = 0;
    for (let i = 0; i < objetivo.length; i++) {
        if (dna[i] === objetivo[i]) {
            puntaje += 1;
        }
    }
    return puntaje / objetivo.length;
}

function reproduce(padreUno, padreDos) {
    // Produce un hijo recombinando los genes de los dos padres
    let hijo = [];
    for (let i = 0; i < padreUno.length; i++) {
        if (Math.random() < 0.5) {
            hijo.push(padreUno[i]);
        } else {
            hijo.push(padreDos[i]);
        }
    }
    return hijo;
}

function mutar(dna, rangoMutacion) {
    // Aplica mutaciones aleatorias a un ADN
    let dnaMutado = [];
    for (let i = 0; i < dna.length; i++) {
        if (Math.random() < rangoMutacion) {
            dnaMutado.push(Math.floor(Math.random() * 1000) + 1);
        } else {
            dnaMutado.push(dna[i]);
        }
    }
    return dnaMutado;
}

function algoritmoGenetico(objetivo, tamPoblacion, rangoMutacion) {
    // Ejecuta un algoritmo genético para encontrar una lista de ADN que coincida con la lista objetivo.
    // Generar la población inicial de ADN como arreglos de números aleatorios
    let poblacion = [];
    for (let i = 0; i < tamPoblacion; i++) {
        let dna = [];
        for (let j = 0; j < objetivo.length; j++) {
            dna.push(Math.floor(Math.random() * 1000) + 1);
        }
        poblacion.push(dna);
    }

    // Bucle principal del algoritmo genético
    let generacion = 0;
    while (true) {
        // Calcular puntuaciones de fitness de la población
        let puntajes = poblacion.map((dna) => fitness(dna, objetivo));
        // Si encontramos una lista de ADN que coincide con la lista objetivo, salir del bucle principal y devolverla
        if (Math.max(...puntajes) === 1) {
            let index = puntajes.indexOf(1);
            return [poblacion[index], generacion];
        }
        // Seleccionar los padres para la siguiente generación a través de selección natural
        let indexPadres = [];
        for (let i = 0; i < 2; i++) {
            let weights = puntajes.map((puntaje) => puntaje ** 2);
            let index = randomChoice(weights);
            indexPadres.push(index);
        }
        // Reproducir los padres para crear la siguiente generación
        let padreUno = poblacion[indexPadres[0]];
        let padreDos = poblacion[indexPadres[1]];
        let hijo = reproduce(padreUno, padreDos);
        // Aplicar mutaciones a la siguiente generación
        hijo = mutar(hijo, rangoMutacion);
        // Reemplazar un miembro de la población con el nuevo hijo
        let index = Math.floor(Math.random() * poblacion.length);
        poblacion[index] = hijo;
        // Incrementar la generación y continuar el bucle principal
        generacion += 1;
        //console.log('Generacion: ', generacion, ' Hijo: ', hijo);
    }
}

function randomChoice(items) {
    // Elige un elemento aleatorio de la lista de items basado en los pesos proporcionados
    let sum = items.reduce((a, b) => a + b, 0);
    let rand = Math.random() * sum;
    let cumulativeProb = 0;
    for (let i = 0; i < items.length; i++) {
        cumulativeProb += items[i];
        if (rand <= cumulativeProb) {
            return i;
        }
    }
}

/** .------------- PRUEBA GENETICO -----------------. */
// Iniciar con lista dada como objetivo
let listaObj = [100, 23, 4, 56, 123, 456];
let resultado, generaciones;
[resultado, generaciones] = algoritmoGenetico(listaObj, 100, 0.01);
console.log("Objetivo:", listaObj);
console.log("Resultado hijo:", resultado);
console.log("generaciones: ", generaciones);


/* ----------------------------- FUNCION PRINCIPAL GENETICO | EVE ------------------------------------------ */
btnInicio.addEventListener("click", () => { 
    start();
    //Inputs del html
    maximaPoblacion = document.getElementById("genMaximas").value;
    individuosPoblacion = document.getElementById("indPoblacion").value;

    individuosElegir = document.getElementById("rangeElegir").value;
    individuosMutar  = document.getElementById("rangeMutar").value;
    individuosCombinar  = document.getElementById("rangeCombinar").value;
    console.log("max pob ", maximaPoblacion, " ind pob ", individuosPoblacion);
    console.log("% elegir: ", individuosElegir, " mutar ", individuosMutar, " comb ", individuosCombinar);
    //stop();
});


/* --------------------------------- Funciones cronometro -------------------------------------- */

function iniciarCronometro() {
    const cronometroElemento = document.getElementById("cronometro");
    segundos++;
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;
    cronometroElemento.textContent = `${agregarCeros(horas)}:${agregarCeros(minutos)}:${agregarCeros(seg)}`;
}

function start() {
    cronometro = setInterval(iniciarCronometro, 1000);
}

function stop() {
    clearInterval(cronometro);
}

function agregarCeros(numero) {
    return numero < 10 ? `0${numero}` : numero;
}
