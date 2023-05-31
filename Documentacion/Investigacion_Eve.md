### Documentación Eve

## 1. Algoritmos Genéticos

```
// Source: https://gist.github.com/TheHoltz/e82b558ae41da50441dbd4b144114a5e
var compareGenes = function(genes)
{
  var targetGene = [1,0,1,0,1,0,1,0,1,0]
  var fit = 0;
  for(var i = 0; i < targetGene.length; i++)
  {
    if(genes[i] === targetGene[i]){
      fit++
    }
  }
  return(
    fit / 10
  )
}

var Dna = function(genes){

    if(genes)
    {
      this.genes = genes;
    } else {
      this.genes = []
    }

    this.fit = 0;

    this.generateDna = function()
    {
      this.genes = Array(10).fill().map(() => Math.random() > .5 ? 1 : 0)
    }

    this.fit = function()
    {
      this.fit = compareGenes(this.genes)
    }

    this.reproduce = function(partner)
    {
      var midpoint = Math.random()*10
      var newGenes = []
      for(var i = 0; i < 10; i++)
      {
        if(i < midpoint)
        {
          newGenes.push(this.genes[i])
        } else {
          newGenes.push(partner.genes[i])
        }
      }

      if(Math.random() > .6)
      {
        var mutacao = Math.floor(Math.random() * newGenes.length - 1)
        newGenes[mutacao] = Number(!newGenes[mutacao])
      }

      return new Dna(newGenes);
    }
}

var Population = function()
{
  this.species = []

  this.createPop = function(n)
  {
    for(var i = 0; i < n; i++)
    {
      this.species.push(new Dna);
      this.species[i].generateDna();
      this.species[i].fit();
    }
  }

  this.fertilize = function()
  {
    var maxFit = 0;
    var newGenerationMaxFit = 0
    var reproductionPool = [];
    var newSpecies = [];
    var firstPartner;
    var secondPartner;

    for(var i = 0; i < this.species.length; i++)
    {
      if(this.species[i].fit > maxFit)
      {
        maxFit = this.species[i].fit;
      }
    }
    for(var j = 0; j < this.species.length; j++)
    {
      this.species[j].fit /= maxFit
    }
    
    for(var k = 0; k < this.species.length; k++)
    {
      for(var m = 0; m < this.species[k].fit * 100; m++)
      {
        reproductionPool.push(this.species[k])
      }
    }

    for(var n = 0; n < this.species.length; n++)
    {
      firstPartner = reproductionPool[Math.floor(Math.random() * (reproductionPool.length - 1))]
      secondPartner = reproductionPool[Math.floor(Math.random() * (reproductionPool.length - 1))]
      newSpecies.push(firstPartner.reproduce(secondPartner))
      newSpecies[n].fit();
      if(newSpecies[n].fit > newGenerationMaxFit){
        newGenerationMaxFit = newSpecies[n].fit;
      }
    }

    this.species = newSpecies;
    console.log(newGenerationMaxFit)

  }

}

var population = new Population()
population.createPop(10)
population.fertilize()

```

```
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
#listaFinal = [int(resultado[i:i+2]) for i in range(0, len(resultado), 2)]
#print('Resultado en lista:', listaFinal)
```

## 2. Canvas para js
```
```

# Videos
https://www.youtube.com/watch?v=ub2h26WiQ_E&ab_channel=Edumorel
https://www.youtube.com/watch?v=zVa9WRF8YDA&ab_channel=deividcopteroProgramaci%C3%B3n
https://www.youtube.com/watch?v=zk3q4UcpEus&ab_channel=DomestikaEnglish
https://www.youtube.com/watch?v=3GqUM4mEYKA&ab_channel=developedbyed //Dibujado

https://www.youtube.com/watch?v=8-O4VlZYS2o&ab_channel=SparshaSaha //Reconstruccion imagen con python y algt gen
Repositorio: https://github.com/SparshaSaha/Genetic-Algorithm-In-Python

https://www.youtube.com/watch?v=VoaAg8tDSFs&ab_channel=SimonDev
https://github.com/simondevyoutube/GeneticAlgorithm-Picture

https://www.youtube.com/watch?v=reFtrppkxsA&ab_channel=PatrikRomansk%C3%BD
use an edge detect algorithm on the image, then for each line I find the distance from the nearest edge for the fitness.