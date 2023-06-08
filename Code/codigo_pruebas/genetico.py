
import random

def fitness(dna, objetivo):
    # Calcula la puntuación de fitness de un ADN basada en la cantidad de números de la lista objetivo que coinciden
    puntaje = 0
    for i in range(len(objetivo)):
        if dna[i] == objetivo[i]:
            puntaje += 1
    return puntaje / len(objetivo)

def reproduce(padreUno, padreDos):
    # Produce un hijo recombinando los genes de los dos padres
    hijo = ''
    for i in range(len(padreUno)):
        if random.randint(0, 1) == 0:
            hijo += padreUno[i]
        else:
            hijo += padreDos[i]
    return hijo

def mutar(dna, rangoMutacion):
    # Aplica mutaciones aleatorias a un ADN
    dnaMutado = ''
    for gen in dna:
        if random.random() < rangoMutacion:
            dnaMutado += str(random.randint(0, 9))
        else:
            dnaMutado += gen
    return dnaMutado

def algoritmoGenetico(objetivo, tamPoblacion, rangoMutacion):
    # Ejecuta un algoritmo genético para encontrar una cadena de ADN que coincida con la lista objetivo.
    # Generar la población inicial de ADN como cadenas de 2 caracteres aleatorios
    poblacion = []
    for i in range(tamPoblacion):
        dna = ''
        for j in range(len(objetivo)):
            dna += str(random.randint(0, 9))
        poblacion.append(dna)

    # Bucle principal del algoritmo genético
    generacion = 0
    while True:
        # Calcular puntuaciones de fitness de la población
        puntajes = [fitness(dna, objetivo) for dna in poblacion]
        # Si encontramos una cadena de ADN que coincide con la lista objetivo, salir del bucle principal y devolverla
        if max(puntajes) == 1:
            index = puntajes.index(1)
            return poblacion[index], generacion
        # Seleccionar los padres para la siguiente generación a través de selección natural
        indexPadres = []
        for i in range(2):
            weights = [puntaje ** 2 for puntaje in puntajes]
            index = random.choices(range(len(poblacion)), weights=weights)[0]
            indexPadres.append(index)
        # Reproducir los padres para crear la siguiente generación
        padreUno = poblacion[indexPadres[0]]
        padreDos = poblacion[indexPadres[1]]
        hijo = reproduce(padreUno, padreDos)
        # Aplicar mutaciones a la siguiente generación
        hijo = mutar(hijo, rangoMutacion)
        # Reemplazar un miembro de la población con el nuevo hijo
        index = random.randint(0, len(poblacion) - 1)
        poblacion[index] = hijo
        # Incrementar la generación y continuar el bucle principal
        generacion += 1
        #print('Generacion: ', generacion, ' Hijo: ', hijo)


# Iniciar con lista dada como objetivo
listaObj = [10,23,15,33,44,4,44,10]
stringObj = ''.join([str(x) for x in listaObj])
resultado, generaciones = algoritmoGenetico(stringObj, 100, 0.01)
print('Objetivo:', listaObj)
print('Resultado hijo:', resultado)
listaFinal = [int(resultado[i:i+2]) for i in range(0, len(resultado), 2)]
print('Resultado en lista:', listaFinal)