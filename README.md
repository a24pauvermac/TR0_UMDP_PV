
# TR0 UMD PAULA VERA

Una aplicació web de quiz sobre banderes de països desenvolupada en PHP, JavaScript i MySQL.

## Estructura del Projecte

```
TR0_UMDP_PV/
├── index.html               # Pàgina principal del quiz
├── landing.html             # Pàgina de benvinguda
├── admin.html               # Panel d'administració
├── css/                     # Estils CSS
│   └── styles.css           # Estils principals amb glassmorphism
├── js/                      # JavaScript
│   ├── script.js            # Lògica del quiz
│   └── admin-gest.js        # Gestió d'administració
├── php/                     # Backend PHP
│   ├── conexio.php          # Connexió a la base de dades
│   ├── getPreguntas.php     # Obtenir preguntes
│   ├── servir_imatge.php    # Servir imatges
│   ├── addPregunta.php      # Afegir preguntes
│   ├── deletePregunta.php   # Eliminar preguntes
│   ├── updatePregunta.php   # Actualitzar preguntes
│   ├── comprovaPregunta.php # Verificar respostes
│   ├── final.php            # Pàgina final
│   └── quiz.json            # Dades de prova
├── assets/                  # Recursos estàtics
│   ├── images/              # Imatges del projecte
│   │   └── background.jpg   # Imatge de fons
│   └── uploads/             # Imatges pujades pels usuaris
│       └── banderas/        # Bandera dels països
└── README.md               # Aquest arxiu
```



## Configuració

### 1. Base de dades
- Crea una base de dades MySQL amb les taules necessàries
- Les taules requerides són: `questions` i `paises`

### 2. Configuració d'arxius
1. Configura les credencials de la base de dades a `php/conexio.php`
2. Asegura't que la carpeta `assets/uploads/banderas/` tingui permisos d'escriptura

### 3. Estructura de la base de dades

#### Taula `questions`
- `id` (INT, PRIMARY KEY)
- `idRespuestaCorrecta` (INT, FOREIGN KEY a paises.id)

#### Taula `paises`
- `id` (INT, PRIMARY KEY)
- `nombre` (VARCHAR)
- `url` (VARCHAR) - URL de la imatge de la bandera

## Ús
1. Obre `landing.html` per començar
2. Introdueix el teu nom per accedir al joc
3. El joc carregarà 10 preguntes aleatòries
4. Selecciona la resposta correcta per a cada bandera
5. Al final veuràs la teva puntuació detallada
6. Accedeix a `admin.html` per gestionar preguntes

## ODS
La meva aplicació de qüestionaris s’alinea amb l’ODS 4 perquè facilita estudiar de manera fàcil i accessible. Permet aprendre des de qualsevol dispositiu, manté una navegació simple sense obstacles tècnics i mostra resultats clars per continuar millorant. Així, aconseguim un aprenentatge senzill i agradable per a tothom, que és just el que promou l’educació de qualitat. A més a més, l’aplicació també té l’objectiu d’entretenir les persones usuàries, creant una sensació de joc alhora que s’aprèn.