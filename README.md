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
assets/img/              logo (SVG), favicon, íconos, imagen para redes (og-image.jpg) y proyectos/ (fotos)
tools/vista-previa.py    arma la versión de vista previa para compartir como Artifact de Claude
```

## Identidad

Tomada del logo de la página de Facebook de Energys 24:

- **Símbolo**: botón de encendido redibujado en vector (`assets/img/logo-mark.svg`); `logo-symbol.svg` y `favicon.svg`
  son la misma marca sobre un círculo blanco, para fondos oscuros, pestañas e íconos.
- **Logotipo**: «ENER» + «GYS 24» con «INGENIERIA ELECTROMECANICA» debajo, escrito en HTML con **Archivo** ancha y gruesa
  (la tipografía de Google Fonts más parecida a la del logo). Sobre fondo oscuro, «ENER» va en blanco.
- **Colores**: azul rey `#1B52A0` (ENER), celeste `#218BC0` (GYS 24) y naranja `#FFB21E → #F57C00` para las acciones
  de cotizar, como en las etiquetas de sus publicaciones. Las variables están al inicio de `styles.css`.
- Si llega el logo original en alta calidad (SVG, AI o PNG grande), reemplazar `logo-mark.svg` / `logo-symbol.svg`.

## Fotos (de Facebook)

Las 24 fotos de `assets/img/proyectos/` son recortes de las miniaturas de las publicaciones de Energys 24 en Facebook,
a partir de capturas de pantalla del perfil. Se descartaron anuncios y diseños gráficos, duplicados y la toma con una persona
de frente; las placas y fachadas no se leen. Miden unos 380 px: sirven para la galería y las tarjetas, pero conviene
reemplazarlas por las fotos originales cuando el negocio las envíe (mismo nombre de archivo, ~1600 px, sin GPS).

- Con foto real: sistemas solares, híbridos con baterías, calentadores solares, piscinas y mantenimiento.
- Con ilustración (no hay fotos aún): bombas de presión, bombeo de pozo, plantas eléctricas y calentadores de agua.
- El comparador **antes/después** sigue ilustrado: en las capturas no hay un par confirmado del mismo lugar.

## Qué falta confirmar (assets/js/config.js)

| Dato | Estado |
| --- | --- |
| WhatsApp / teléfono `+506 8887 7242` | del perfil de Facebook (tiene botón de WhatsApp) |
| Segundo teléfono `+506 8430 6090` | del aviso de números oficiales publicado en Facebook |
| Correo `grupopramac@gmail.com` | aparece en la ficha pública: confirmar que sea el del negocio |
| Dirección exacta (`direccionDetalle`, `mapaConsulta`) | hoy el mapa apunta a Desamparados centro |
| Horario, zona de cobertura, años de experiencia, cédula jurídica | `null` → «Por confirmar» |
| Logo en alta calidad, Instagram/TikTok | pendientes |
| Textos de servicios, diagnóstico y preguntas | propuesta: revisar con el negocio |
| Fotos originales y de bombas, pozos, plantas y calentadores | pendientes (ver «Fotos») |

Con todo confirmado, cambiar `demo: true` a `demo: false`: lo que siga vacío se oculta solo.

## Fotos

- **Servicios**: `imagen: 'assets/img/proyectos/<archivo>.webp'` en cada servicio. Sin foto se usa su ilustración.
- **Galería** (hasta 25): en `galeria`, `{ foto: 'assets/img/proyectos/<archivo>.webp', titulo, categoria, zona }`.
  Las primeras 12 se muestran de entrada y el resto con «Ver más».
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
