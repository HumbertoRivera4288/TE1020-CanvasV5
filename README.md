# Atlas Eléctrico de México | SolarPro
Versión integral de la etapa 4: cinco módulos con información, actividades interactivas, simuladores y fuentes.

## Archivos
- `index.html`: sitio completo de una sola página con navegación por módulos.
- `css/styles.css`: diseño responsivo.
- `js/app.js`: clasificador, diagramas, gráficas, comparador, reflexión, mapa referencial y simuladores.
- `FUENTES_Y_METODOLOGIA.md`: trazabilidad de cifras y límites de interpretación.

## Publicar en GitHub Pages
1. Descomprime el ZIP.
2. Sube **todos** los archivos y carpetas a la raíz del repositorio, conservando su estructura.
3. En GitHub: Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
4. Guarda y espera la publicación.

## Funcionalidades incluidas
- Módulo 0: 15 tarjetas clasificables, seis diagramas de conversión seleccionables, matriz nacional 2022 y evolución CFE 2022–2024, comparador y cinco preguntas de reflexión.
- Módulo 1: mapa esquemático interactivo de 15 centrales reales en más de cinco entidades y cuatro tecnologías; filtros y fichas con capacidades y fuente; gráficas y conceptos de generación.
- Módulo 2: explicación de cuatro sistemas eléctricos, indicadores de transmisión y simulador trifásico de corriente y pérdidas.
- Módulo 3: indicadores de redes, pérdidas y continuidad; simulador de transformador ideal.
- Módulo 4: 20 hallazgos, filtros por categoría y apartado especial de reforma energética 2013–2025.

## Límites importantes
- Los datos nacionales de generación 2022 y los datos exclusivos de CFE se identifican por separado.
- El mapa de centrales utiliza ubicaciones referenciales, no coordenadas oficiales. Algunas capacidades son históricas o corresponden a fichas de proyectos de modernización; se indica en las fichas.
- El esquema de transmisión no inventa líneas ni conecta sistemas aislados.
- No se inventan límites regionales de distribución; falta cartografía oficial de CFE Distribución para mostrar las divisiones como polígonos.
- No se inventan factores de emisión. Se distinguen emisiones directas y de ciclo de vida de manera cualitativa.
- Los simuladores son modelos educativos simplificados, no herramientas de diseño u operación.


## Recursos visuales y comparador de emisiones
La carpeta `assets/` contiene ilustraciones originales de energía solar, eólica e hidroeléctrica. El mapa base de México se carga desde Wikimedia Commons (archivo “Blank Mexico map, no States.svg”, licencia CC BY-SA 2.5); por ello, la publicación requiere conexión a internet para mostrar esa silueta.

El comparador incorpora medianas internacionales aproximadas de emisiones de ciclo de vida del IPCC (2014), en g CO₂e/kWh. Se identifican como referencias globales y no como mediciones de plantas mexicanas.
