# TR0 UMD PAULA VERA

Una aplicació web de quiz sobre banderes de països desenvolupada en PHP, JavaScript i MySQL.

## Configuració

### 1. Base de dades
- Crea una base de dades MySQL amb les taules necessàries
- Les taules requerides són: `questions` i `paises`

### 2. Configuració d'arxius
1. Copia `conexio.php.example` com `conexio.php`
2. Actualitza les credencials de la base de dades a `conexio.php`

### 3. Estructura de la base de dades

#### Taula `questions`
- `id` (INT, PRIMARY KEY)
- `idRespuestaCorrecta` (INT, FOREIGN KEY a paises.id)

#### Taula `paises`
- `id` (INT, PRIMARY KEY)
- `nombre` (VARCHAR)
- `url` (VARCHAR) - URL de la imatge de la bandera

## Ús
1. Obre `index.html` al teu navegador
2. El joc carregarà 10 preguntes aleatòries
3. Selecciona la resposta correcta per a cada bandera
4. Al final veuràs la teva puntuació total

## ODS
La meva aplicació de qüestionaris s’alinea amb l’ODS 4 perquè facilita estudiar de manera fàcil i accessible. Permet aprendre des de qualsevol dispositiu, manté una navegació simple sense obstacles tècnics i mostra resultats clars per continuar millorant. Així, aconseguim un aprenentatge senzill i agradable per a tothom, que és just el que promou l’educació de qualitat. A més a més, l’aplicació també té l’objectiu d’entretenir les persones usuàries, creant una sensació de joc alhora que s’aprèn.