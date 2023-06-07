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
/*
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
*/

/* ----------------------------- FUNCION PRINCIPAL GENETICO | EVE ------------------------------------------ */
btnInicio.addEventListener("click", () => {
    start();
    //Inputs del html
    maximaPoblacion = document.getElementById("genMaximas").value;
    individuosPoblacion = document.getElementById("indPoblacion").value;

    individuosElegir = document.getElementById("rangeElegir").value;
    individuosMutar = document.getElementById("rangeMutar").value;
    individuosCombinar = document.getElementById("rangeCombinar").value;
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


// *************************************
function fitness(dna, objetivo) {
    // Calcula la puntuación de fitness de un ADN basada en la similitud entre la imagen generada y la imagen objetivo
    // Aquí debes implementar la lógica para comparar las imágenes y obtener el puntaje de similitud
    // Retorna un valor entre 0 y 1 que representa el porcentaje de similitud
    const canvasCopy = document.createElement("canvas");
    canvasCopy.width = canvas.width;
    canvasCopy.height = canvas.height;
    const contextCopy = canvasCopy.getContext("2d");

    // Dibujar el ADN en el canvas copia
    contextCopy.clearRect(0, 0, canvasCopy.width, canvasCopy.height);
    contextCopy.beginPath();
    contextCopy.moveTo(dna[0].x, dna[0].y);
    for (let i = 1; i < dna.length; i++) {
        contextCopy.lineTo(dna[i].x, dna[i].y);
    }
    contextCopy.stroke();

    // Comparar la imagen generada con la imagen objetivo
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const imageDataCopy = contextCopy.getImageData(0, 0, canvasCopy.width, canvasCopy.height);
    let puntaje = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r1 = imageData.data[i];
        const g1 = imageData.data[i + 1];
        const b1 = imageData.data[i + 2];
        const r2 = imageDataCopy.data[i];
        const g2 = imageDataCopy.data[i + 1];
        const b2 = imageDataCopy.data[i + 2];
        if (r1 === r2 && g1 === g2 && b1 === b2) {
            puntaje += 1;
        }
    }
    return puntaje / (imageData.data.length / 4);
}

function reproduce(padreUno, padreDos) {
    // Produce un hijo recombinando los genes de los dos padres
    // Aquí debes implementar la lógica para combinar las coordenadas de los padres y generar un nuevo hijo
    // Retorna el nuevo hijo generado
    const hijo = [];
    const puntoCruce = Math.floor(Math.random() * padreUno.length);
    for (let i = 0; i < padreUno.length; i++) {
        if (i < puntoCruce) {
            hijo.push(padreUno[i]);
        } else {
            hijo.push(padreDos[i]);
        }
    }
    return hijo;
}

function mutar(dna, rangoMutacion) {
    // Aplica mutaciones aleatorias a un ADN
    // Aquí debes implementar la lógica para aplicar mutaciones a las coordenadas del ADN
    // Retorna el ADN mutado
    const dnaMutado = [];
    for (let i = 0; i < dna.length; i++) {
        if (Math.random() < rangoMutacion) {
            // Generar nuevas coordenadas aleatorias
            const nuevaCoordenada = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
            };
            dnaMutado.push(nuevaCoordenada);
        } else {
            dnaMutado.push(dna[i]);
        }
    }
    return dnaMutado;
}

function algoritmoGenetico(objetivo, tamPoblacion, rangoMutacion) {
    // Ejecuta un algoritmo genético para encontrar una lista de coordenadas que genere una imagen similar al objetivo.
    // Generar la población inicial de ADN como listas de coordenadas aleatorias
    let poblacion = [];
    for (let i = 0; i < tamPoblacion; i++) {
        let dna = [];
        for (let j = 0; j < objetivo.length; j++) {
            // Generar coordenadas aleatorias aquí, por ejemplo:
            dna.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
            });
        }
        poblacion.push(dna);
    }

    // Bucle principal del algoritmo genético
    let generacion = 0;
    while (true) {
        // Calcular puntuaciones de fitness de la población
        let puntajes = poblacion.map((dna) => fitness(dna, objetivo));
        // Si encontramos una lista de coordenadas que genere una imagen similar al objetivo, salir del bucle principal y devolverla
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

function generarListaCoordenadas() {
    const minSize = 100;
    const maxSize = Math.floor(Math.random() * 100) + minSize;
    const listaCoordenadas = [];

    for (let i = 0; i < maxSize; i++) {
        const coordenada = {
            x: Math.floor(Math.random() * 500), // Rango de valores para la coordenada x
            y: Math.floor(Math.random() * 500) // Rango de valores para la coordenada y
        };
        listaCoordenadas.push(coordenada);
    }

    return listaCoordenadas;
}

const listaObj = generarListaCoordenadas();
console.log(listaObj); // Imprime la lista de coordenadas generada aleatoriamente


let resultado, generaciones;
[resultado, generaciones] = algoritmoGenetico(listaObj, 100, 0.01);
console.log('Objetivo:', listaObj);
console.log('Resultado hijo:', resultado);
console.log('Generaciones: ', generaciones);