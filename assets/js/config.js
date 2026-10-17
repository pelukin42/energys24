/* ==========================================================================
   ENERGYS 24 — CONFIGURACIÓN DEL SITIO
   --------------------------------------------------------------------------
   Todo lo que cambia del negocio (contacto, redes, servicios, fotos, galería,
   preguntas frecuentes) se edita AQUÍ. No hace falta tocar el HTML.

   Modo propuesta (demo: true): lo que esté en null se muestra como
   «Por confirmar» y aparece el aviso de propuesta. Con todo confirmado,
   cambie demo a false: lo vacío simplemente se oculta.
   ========================================================================== */
window.E24_CONFIG = {
  demo: true,

  nombre: 'Energys 24',
  razonSocial: 'Energys 24 SRL',
  eslogan: 'Energía y agua que no se detienen.',
  // Dominio definitivo (ej. 'https://www.energys24.com'). Vacío mientras no exista:
  // así no se publica una URL falsa en las etiquetas de Google y redes.
  sitioWeb: '',

  /* ---------- Contacto (tomado de la página pública de Facebook) ---------- */
  // WhatsApp con código de país, solo dígitos (Costa Rica = 506). Confirmar que tenga WhatsApp.
  whatsapp: '50688877242',
  telefono: '+506 8887 7242',
  // Correo que aparece en la página de Facebook: confirmar que sea el del negocio.
  correo: 'grupopramac@gmail.com',
  direccion: 'Desamparados, San José',
  direccionDetalle: null,            // Ej.: '200 m sur de la iglesia' (por confirmar)
  // Texto para Google Maps / Waze (dirección exacta o nombre del local tal como sale en Maps).
  mapaConsulta: 'Desamparados, San José, Costa Rica',
  mapaZoom: 14,
  // Ej.: [['Lunes a viernes', '7:30 a. m. – 5:00 p. m.'], ['Sábados', '8:00 a. m. – 12:00 m. d.']]
  horario: null,
  zonaCobertura: null,               // Ej.: 'Gran Área Metropolitana y zona sur' (por confirmar)
  cedulaJuridica: null,
  anios: null,                       // años de experiencia (número), por confirmar

  /* ---------- Redes sociales: solo se muestran las que tengan URL ---------- */
  redes: {
    facebook: 'https://www.facebook.com/Energys24/',
    instagram: '',
    tiktok: '',
    youtube: '',
    linkedin: ''
  },

  /* ---------- Formularios ----------
     Opcional: URL de Formspree, Getform, Web3Forms, etc. para recibir el cotizador y el
     contacto por correo sin abrir el programa de correo. Vacío = WhatsApp y correo. */
  formEndpoint: '',
  mensajeWhatsApp: 'Hola Energys 24, quisiera información sobre sus servicios.',
  firmaWhatsApp: 'Enviado desde el sitio web de Energys 24',

  /* ---------- Calculadora solar (estimación referencial) ----------
     hsp: horas solares pico promedio; pr: rendimiento del sistema; panelW: potencia por panel. */
  solar: { hsp: 4.5, pr: 0.8, panelW: 550, m2PorPanel: 2.6, consumoInicial: 400 },

  /* ---------- Fotos ----------
     Cada servicio acepta  imagen: 'assets/img/servicios/<archivo>.webp'.
     Sin foto, la tarjeta usa la ilustración de su línea de servicio.
     antesDespues: fotos reales del comparador (las dos o ninguna). */
  antesDespues: { antes: '', despues: '', titulo: '' },

  /* ---------- Galería de proyectos (hasta 25 fotos) ----------
     { foto: 'assets/img/proyectos/<archivo>.webp', titulo: '...', categoria: 'solar', zona: null }
     categoria: solar | agua | piscinas | plantas | calentadores | mantenimiento
     Mientras foto sea null se muestra una tarjeta ilustrada «Foto por confirmar». */
  galeria: [
    { foto: null, titulo: 'Sistema solar en techo residencial', categoria: 'solar' },
    { foto: null, titulo: 'Equipo de presión e hidroneumático', categoria: 'agua' },
    { foto: null, titulo: 'Cuarto de máquinas de piscina', categoria: 'piscinas' },
    { foto: null, titulo: 'Planta eléctrica con transferencia', categoria: 'plantas' },
    { foto: null, titulo: 'Calentador solar de agua', categoria: 'calentadores' },
    { foto: null, titulo: 'Bomba sumergible para pozo', categoria: 'agua' },
    { foto: null, titulo: 'Sistema híbrido con baterías', categoria: 'solar' },
    { foto: null, titulo: 'Mantenimiento preventivo', categoria: 'mantenimiento' }
  ],

  /* ---------- Servicios (hasta 10) ----------
     icono: sun | battery | droplet | gauge | waves | generator | flame | heater | wrench
     categoria: id de la lista de categorías
     arte: ilustración de la tarjeta cuando no hay foto (solar | hibrido | termosolar | presion | pozo | piscina | planta | calentador | mantenimiento) */
  categorias: [
    { id: 'todos', nombre: 'Todos' },
    { id: 'solar', nombre: 'Energía solar' },
    { id: 'agua', nombre: 'Bombeo y agua' },
    { id: 'piscinas', nombre: 'Piscinas' },
    { id: 'plantas', nombre: 'Plantas eléctricas' },
    { id: 'calentadores', nombre: 'Agua caliente' },
    { id: 'mantenimiento', nombre: 'Mantenimiento' }
  ],

  tiposTrabajo: ['Venta', 'Instalación', 'Mantenimiento', 'Reparación'],

  servicios: [
    {
      id: 'solar', icono: 'sun', categoria: 'solar', arte: 'solar',
      nombre: 'Sistemas solares conectados a la red',
      descripcion: 'Paneles solares para bajar el consumo eléctrico de su casa, negocio o finca, dimensionados según su recibo.',
      puntos: ['Estudio de consumo y del techo', 'Paneles, inversor y estructura', 'Instalación y puesta en marcha', 'Acompañamiento en el trámite con la distribuidora']
    },
    {
      id: 'hibrido', icono: 'battery', categoria: 'solar', arte: 'hibrido',
      nombre: 'Sistemas híbridos y con baterías',
      descripcion: 'Energía solar con respaldo: sus equipos esenciales siguen funcionando cuando se va la luz.',
      puntos: ['Baterías de respaldo', 'Inversores híbridos', 'Selección de cargas esenciales', 'Sistemas aislados para fincas y cabinas']
    },
    {
      id: 'termosolar', icono: 'heater', categoria: 'calentadores', arte: 'termosolar',
      nombre: 'Calentadores solares de agua',
      descripcion: 'Agua caliente con la energía del sol para duchas, cocinas y piscinas.',
      puntos: ['Colectores y termotanques', 'Dimensionamiento según personas', 'Instalación en techo', 'Mantenimiento y limpieza']
    },
    {
      id: 'presion', icono: 'gauge', categoria: 'agua', arte: 'presion',
      nombre: 'Bombas y sistemas de presión',
      descripcion: 'Presión de agua constante en toda la propiedad, incluso en segundos pisos y horas pico.',
      puntos: ['Presurizadores e hidroneumáticos', 'Bombas centrífugas y periféricas', 'Tanques y control de nivel', 'Revisión de fugas y consumo']
    },
    {
      id: 'pozos', icono: 'droplet', categoria: 'agua', arte: 'pozo',
      nombre: 'Bombeo de pozo y bombeo solar',
      descripcion: 'Agua de pozo o naciente para la casa, el riego o el ganado, con bombas eléctricas o solares.',
      puntos: ['Bombas sumergibles', 'Bombeo solar sin electricidad', 'Tableros de control y protección', 'Riego y abastecimiento en fincas']
    },
    {
      id: 'piscinas', icono: 'waves', categoria: 'piscinas', arte: 'piscina',
      nombre: 'Equipos para piscinas',
      descripcion: 'Agua limpia y equipos eficientes: filtración, recirculación y calentamiento de piscinas.',
      puntos: ['Bombas y filtros', 'Cloradores y dosificación', 'Calentamiento solar o con bomba de calor', 'Cuarto de máquinas ordenado']
    },
    {
      id: 'plantas', icono: 'generator', categoria: 'plantas', arte: 'planta',
      nombre: 'Plantas eléctricas',
      descripcion: 'Respaldo eléctrico para que su casa, comercio o empresa no se detenga cuando falla la red.',
      puntos: ['Venta e instalación de generadores', 'Transferencias manuales y automáticas', 'Cálculo de la potencia necesaria', 'Mantenimiento y pruebas periódicas']
    },
    {
      id: 'calentadores', icono: 'flame', categoria: 'calentadores', arte: 'calentador',
      nombre: 'Calentadores de agua',
      descripcion: 'Calentadores de tanque y de paso instalados de forma segura y con la protección eléctrica correcta.',
      puntos: ['Calentadores de tanque', 'Calentadores de paso', 'Conexión eléctrica y protecciones', 'Reparación y cambio de resistencias']
    },
    {
      id: 'mantenimiento', icono: 'wrench', categoria: 'mantenimiento', arte: 'mantenimiento',
      nombre: 'Mantenimiento preventivo y correctivo',
      descripcion: 'Revisiones programadas para que sus equipos duren más y fallen menos.',
      puntos: ['Limpieza de paneles solares', 'Revisión de bombas y tableros', 'Pruebas de plantas eléctricas', 'Atención de fallas']
    }
  ],

  /* ---------- Cifras de la portada ----------
     valor numérico = se anima; texto = se muestra tal cual. No publicar cifras sin confirmar. */
  estadisticas: [
    { valor: 9, etiqueta: 'servicios especializados' },
    { texto: 'Venta + instalación', etiqueta: 'y mantenimiento' },
    { texto: 'Desamparados', etiqueta: 'San José, Costa Rica' },
    { texto: 'Sin compromiso', etiqueta: 'cotización y asesoría' }
  ],

  /* ---------- Diagnóstico rápido ----------
     servicio = id de un servicio de la lista. Los consejos son seguros y generales. */
  diagnostico: [
    {
      id: 'recibo', icono: 'sun', servicio: 'solar',
      titulo: 'Mi recibo de luz está muy alto',
      detalle: 'Quiero bajar lo que pago de electricidad.',
      tips: [
        'Busque en su recibo el consumo en kWh de los últimos meses: es el dato clave para dimensionar un sistema.',
        'Pruebe la calculadora solar de esta página con ese consumo.',
        'Tome fotos del techo y anote si le da sombra en algún momento del día.',
        'Identifique los equipos que más consumen: aire acondicionado, calentador, bombas, refrigeración.'
      ]
    },
    {
      id: 'apagones', icono: 'generator', servicio: 'plantas',
      titulo: 'Se va la luz y necesito respaldo',
      detalle: 'Cortes que afectan la casa o el negocio.',
      tips: [
        'Haga una lista de lo que no puede apagarse: refrigeración, bombas, portones, computadoras, iluminación.',
        'Nunca conecte una planta eléctrica directo a un tomacorriente o al tablero sin transferencia: puede electrocutar a quien trabaja en la red.',
        'Si ya tiene planta, enciéndala en un lugar ventilado, nunca dentro de la casa ni del garaje cerrado.',
        'Anote cuánto suelen durar los cortes: define si conviene planta, baterías o ambas.'
      ]
    },
    {
      id: 'presion', icono: 'gauge', servicio: 'presion',
      titulo: 'Tengo poca presión de agua',
      detalle: 'Las duchas o el segundo piso casi no tienen agua.',
      tips: [
        'Revise si pasa en todos los grifos o solo en uno: si es uno solo, puede ser el aireador o la llave.',
        'Verifique el nivel del tanque de almacenamiento, si tiene.',
        'Si la bomba arranca y se detiene muy seguido, apáguela: puede haber una fuga o un problema en el tanque de presión.',
        'No deje una bomba funcionando sin agua: se daña en pocos minutos.'
      ]
    },
    {
      id: 'pozo', icono: 'droplet', servicio: 'pozos',
      titulo: 'La bomba del pozo no arranca',
      detalle: 'No sube agua, bota la cuchilla o se calienta.',
      tips: [
        'Apague el breaker de la bomba antes de revisar cualquier cosa.',
        'Si el breaker se dispara, no lo suba una y otra vez: puede quemar el motor.',
        'Anote la profundidad del pozo y la edad de la bomba si las conoce.',
        'Si hay olor a quemado o ruidos extraños, déjela apagada y consúltenos.'
      ]
    },
    {
      id: 'piscina', icono: 'waves', servicio: 'piscinas',
      titulo: 'El agua de la piscina está turbia o verde',
      detalle: 'La bomba, el filtro o el cloro no están dando abasto.',
      tips: [
        'Confirme que la bomba esté funcionando las horas suficientes cada día.',
        'Limpie la canasta del skimmer y la del prefiltro de la bomba (con la bomba apagada).',
        'Revise el manómetro del filtro: si la presión subió mucho, puede necesitar retrolavado.',
        'Mida cloro y pH antes de agregar más químicos.'
      ]
    },
    {
      id: 'calentador', icono: 'flame', servicio: 'calentadores',
      titulo: 'El calentador no calienta',
      detalle: 'Sale agua fría o se dispara el breaker.',
      tips: [
        'Revise si el breaker del calentador está abajo; súbalo solo una vez.',
        'Si se vuelve a disparar, déjelo apagado: puede ser la resistencia o una fuga.',
        'Revise si hay goteo en el tanque o en las conexiones.',
        'Antes de abrir cualquier tapa, corte la electricidad desde el breaker.'
      ]
    }
  ],

  /* ---------- Preguntas frecuentes (propuesta: ajustar con el negocio) ---------- */
  faq: [
    {
      p: '¿Cómo sé qué tamaño de sistema solar necesito?',
      r: 'Partimos de su consumo en kWh (aparece en el recibo de luz) y del espacio disponible en el techo. La calculadora de esta página da una idea inicial; el tamaño final se define con una visita técnica.'
    },
    {
      p: '¿Con paneles solares sigo teniendo luz cuando hay un apagón?',
      r: 'Un sistema conectado a la red se apaga por seguridad cuando la red falla. Para tener luz durante los cortes se necesita un sistema híbrido con baterías o una planta eléctrica con transferencia. Le ayudamos a elegir la opción adecuada.'
    },
    {
      p: '¿Qué potencia de planta eléctrica necesito?',
      r: 'Depende de los equipos que quiera respaldar y de cómo arrancan (motores, bombas y aires acondicionados piden más al encender). Hacemos el cálculo con usted antes de recomendar un equipo.'
    },
    {
      p: '¿Venden los equipos o solo los instalan?',
      r: 'Hacemos venta, instalación, mantenimiento y reparación. Si usted ya tiene el equipo, también podemos revisarlo e instalarlo.'
    },
    {
      p: '¿Trabajan en casas, comercios y fincas?',
      r: 'Sí: atendemos proyectos residenciales, comerciales y agrícolas, desde una bomba para la casa hasta bombeo solar para riego. Escríbanos su zona para confirmar cobertura.'
    },
    {
      p: '¿Cómo funciona la cotización?',
      r: 'Complete el cotizador o escríbanos por WhatsApp. Con esos datos le enviamos una propuesta o coordinamos una visita técnica cuando hace falta medir o revisar en sitio.'
    },
    {
      p: '¿Cada cuánto hay que dar mantenimiento?',
      r: 'Depende del equipo y del uso. Como referencia, las plantas eléctricas, bombas y equipos de piscina se benefician de revisiones periódicas, y los paneles solares de una limpieza según el polvo de la zona. Le proponemos un plan a la medida.'
    }
  ]
};
