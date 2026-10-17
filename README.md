# Energys 24 — sitio web

Sitio estático (HTML + CSS + JavaScript, **sin dependencias ni paso de compilación**) para
**Energys 24 SRL**, electromecánica en Desamparados, San José: sistemas solares, bombeo de agua,
equipos para piscinas, plantas eléctricas y calentadores. Hecho con el alcance del **plan Profesional**
de AxelSites y con lo mejor de los últimos sitios (Bassett Tecnología, Constructora IDESA y Mundo Online CR).

## Qué incluye

| Plan Profesional | Dónde está en el sitio |
| --- | --- |
| Hasta 10 servicios con foto y descripción | **Servicios** (9), con filtro por línea, botón *Cotizar* y *WhatsApp* en cada uno |
| Hasta 3 secciones ampliadas | **Inicio**, **Servicios** y **Proyectos** (más sistema interactivo, calculadora, diagnóstico y nosotros) |
| Galería de hasta 25 fotos, con antes y después | **Proyectos**: comparador antes/después y galería en mosaico con filtro y visor |
| Formulario de cotización + solicitud de citas | **Cotizador** en 4 pasos con **visita técnica** (fecha y horario preferidos) y resumen en vivo |
| Botón de WhatsApp y Google Maps | WhatsApp en encabezado, portada, cada servicio y botón flotante con menú rápido; **mapa** con *Cómo llegar* y *Waze* |
| Optimizada para Google | Título y descripción, Open Graph, datos estructurados (negocio local + preguntas frecuentes), `robots.txt` |
| Redes sociales | Facebook en barra superior, contacto y pie (las demás aparecen solas al agregar su enlace) |

Además:

- **Su sistema, de punta a punta** (idea de la red interactiva de Bassett): diagrama con energía (ámbar) y agua (celeste)
  que recorren paneles, inversor, red eléctrica, planta, pozo, bomba de presión, piscina y calentadores. Cada equipo abre su
  servicio y lo agrega al cotizador.
- **Calculadora solar**: con el consumo en kWh del recibo estima potencia (kWp), número de paneles, área de techo y generación.
  Es referencial (4,5 horas solares pico, rendimiento 80 %, paneles de 550 W: se cambian en `config.js` → `solar`).
- **Diagnóstico rápido**: seis problemas comunes con primeros pasos seguros y el servicio recomendado.
- **Modo propuesta** (de IDESA): mientras `demo: true`, lo no confirmado dice «Por confirmar» y se ve el aviso superior.
- **WhatsApp con firma y origen** (de Mundo Online y AxelSites): los mensajes armados terminan con «Enviado desde el sitio web
  de Energys 24» y, si la visita viene de un anuncio con UTM, con `(ref: fuente/campaña/anuncio)`.
- Intro con la marca (una vez por sesión), portada con palabra que cambia y corrientes animadas, modo claro/oscuro,
  barra de progreso, menú móvil, accesible por teclado y con «reducir movimiento».

## Estructura

```
index.html               página única
assets/css/styles.css    estilos; la paleta está en las variables del inicio
assets/js/config.js      ⭐ DATOS DEL NEGOCIO: contacto, redes, servicios, galería, FAQ, calculadora
assets/js/app.js         lógica (cotizador, calculadora, sistema, galería, diagnóstico, WhatsApp)
assets/js/visuals.js     ilustraciones en código (servicios, galería, antes/después) y animación de la portada
assets/img/              símbolo de la marca (SVG), favicon, íconos y imagen para redes (og-image.jpg)
tools/vista-previa.py    arma la versión de vista previa para compartir como Artifact de Claude
```

## Identidad (provisional)

La página de Facebook no se pudo leer sin iniciar sesión, así que la marca es una **propuesta**: símbolo circular con rayo
(energía) sobre agua (bombeo y piscinas), palabra **ENERGYS** con el **24** en ámbar, tipografías **Saira** (títulos) y
**DM Sans** (texto), y paleta azul noche `#071729`, ámbar `#FFC62B → #FF8A00` y celeste `#3FE0F2 / #0B84B0`.
Si Energys 24 ya tiene logo: reemplazar `assets/img/logo-symbol.svg` (y `favicon.svg`) y ajustar los colores al inicio de
`styles.css`; el texto de la marca está en `.brand__word` del HTML.

## Qué falta confirmar (assets/js/config.js)

| Dato | Estado |
| --- | --- |
| WhatsApp / teléfono `+506 8887 7242` | tomado de la ficha pública de Facebook: confirmar que tenga WhatsApp |
| Correo `grupopramac@gmail.com` | aparece en la ficha pública: confirmar que sea el del negocio |
| Dirección exacta (`direccionDetalle`, `mapaConsulta`) | hoy el mapa apunta a Desamparados centro |
| Horario, zona de cobertura, años de experiencia, cédula jurídica | `null` → «Por confirmar» |
| Logo oficial, Instagram/TikTok | pendientes |
| Textos de servicios, diagnóstico y preguntas | propuesta: revisar con el negocio |
| Fotos reales de trabajos | la galería y las tarjetas usan ilustraciones mientras tanto |

Con todo confirmado, cambiar `demo: true` a `demo: false`: lo que siga vacío se oculta solo.

## Fotos

- **Servicios**: `imagen: 'assets/img/servicios/<archivo>.webp'` en cada servicio. Sin foto se usa su ilustración.
- **Galería** (hasta 25): en `galeria`, `{ foto: 'assets/img/proyectos/<archivo>.webp', titulo, categoria, zona }`.
  `foco: '50% 30%'` opcional para elegir qué parte de la foto no se recorta.
- **Antes / después**: `antesDespues: { antes, despues, titulo }` (las dos o ninguna).
- Fotos en WebP o JPG de unos 1600 px de ancho, **sin ubicación GPS** y revisando placas, números de casa, rostros y
  documentos antes de subirlas (el repositorio es público).

## Ver en local

```bash
python3 -m http.server 8000     # abrir http://localhost:8000
```

## Publicar

- **Netlify**: *Import from Git* → este repositorio, sin comando de build, publicar desde la raíz (`_headers` ya está).
- **Al tener dominio**: poner la URL en `sitioWeb` (`config.js`), agregar en el `<head>`
  `<link rel="canonical">`, `og:url` y `og:image` con la URL completa, crear `sitemap.xml` y agregar su línea en `robots.txt`.
- **Formulario por correo** (opcional): URL de Formspree, Getform o Web3Forms en `formEndpoint`. Sin eso, el cotizador
  y el contacto envían por WhatsApp o abren el correo.
- **Vista previa como Artifact**: `python3 -I tools/vista-previa.py . SALIDA.html` y publicar ese archivo con el mapa
  `files` que imprime (en la vista previa el mapa se reemplaza por un enlace, porque los Artifacts no permiten mapas incrustados).
