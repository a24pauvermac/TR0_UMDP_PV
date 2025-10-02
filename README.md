# Quiz de Banderes dels Països

Un quiz interactiu per endevinar banderes de països amb una interfície moderna i estètica glassmorphism.

## Estructura del Projecte

```
TR0_UMDP_PV/
├── index.php                 # Punt d'entrada principal
├── src/                      # Codi font
│   ├── html/                 # Pàgines HTML
│   │   ├── index.html        # Pàgina principal del quiz
│   │   ├── admin.html        # Panel d'administració
│   │   └── landing.html      # Pàgina de benvinguda
│   ├── css/                  # Estils CSS
│   │   └── styles.css        # Estils principals amb glassmorphism
│   ├── js/                   # JavaScript
│   │   ├── script.js         # Lògica del quiz
│   │   └── admin-gest.js     # Gestió d'administració
│   └── php/                  # Backend PHP
│       ├── conexio.php       # Connexió a la base de dades
│       ├── getPreguntas.php  # Obtenir preguntes
│       ├── servir_imatge.php # Servir imatges
│       ├── addPregunta.php   # Afegir preguntes
│       ├── deletePregunta.php# Eliminar preguntes
│       ├── updatePregunta.php# Actualitzar preguntes
│       ├── comprovaPregunta.php # Verificar respostes
│       ├── final.php         # Pàgina final
│       ├── getNovaPregunta   # Obtenir nova pregunta
│       └── quiz.json         # Dades de prova
├── assets/                   # Recursos estàtics
│   ├── images/               # Imatges del projecte
│   │   └── background.jpg    # Imatge de fons
│   └── uploads/              # Imatges pujades pels usuaris
│       └── banderas/         # Bandera dels països
├── config/                   # Configuració
│   ├── docker-compose.yml    # Configuració Docker
│   ├── Dockerfile           # Imatge Docker
│   ├── nginx.conf           # Configuració Nginx
│   ├── init.sql             # Inicialització BBDD
│   └── conexio.php.example  # Exemple de connexió
├── docs/                    # Documentació
│   ├── README.md            # Aquest arxiu
│   └── README-DOCKER.md     # Documentació Docker
└── .gitignore              # Fitxers a ignorar per Git
```

## Començar

### Opció 1: Servidor PHP Local
```bash
php -S localhost:8000
# Accedir a: http://localhost:8000
```

### Opció 2: Docker (Recomanat)
```bash
cd config
docker-compose up --build
# Accedir a: http://localhost:8080
```

## Funcionalitats

### Gameplay
- Quiz de 10 preguntes aleatòries sobre banderes
- Timer de 5 minuts amb barra de progrés visual
- Layout 2x2 per les respostes
- Contador de preguntes (Pregunta X de 10)
- Persistència amb localStorage

### Interfície
- Disseny glassmorphism modern
- Responsive design (mòbil i desktop)
- Animacions suaus i transicions
- Icona de casa per navegar entre pàgines
- Font Libertinus Keyboard per "umdp"

### Administració
- Panel d'administració complet
- Gestió d'imatges locals i externes
- Afegir, editar i eliminar preguntes
- Càrrega segura d'imatges

### Tècnic
- Connexió automàtica Docker/Local
- Gestió d'errors robusta
- Codi net i ben documentat

## Tecnologies

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP 8.4
- **Base de dades**: MySQL 8.0
- **Servidor web**: Nginx
- **Contenidor**: Docker & Docker Compose

## Notes

- Les imatges locals es guarden a `assets/uploads/banderas/`
- Les imatges externes es carreguen directament des de URLs
- La configuració de la base de dades és automàtica (Docker vs Local)
