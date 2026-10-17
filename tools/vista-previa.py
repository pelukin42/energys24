#!/usr/bin/env python3
"""Arma la vista previa del sitio para publicarla como Artifact de Claude y lista los archivos que la acompañan.

  python3 -I tools/vista-previa.py RAIZ_DEL_SITIO SALIDA.html

Quita doctype/html/head/body (el Artifact pone su propio esqueleto), conserva el título, las fuentes, la hoja de
estilos y el tema, y deja todo visible al cargar (sin intro ni animaciones de aparición). El mapa de Google se
reemplaza por un enlace, porque los Artifacts no permiten mapas incrustados. Imprime en JSON el mapa `files`
(css, js e imágenes que el sitio usa). Termina con código 1 si algún archivo supera los límites de publicación.
"""
import json
import os
import re
import sys

TITULO = "Energys 24"


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    raiz, salida = sys.argv[1], sys.argv[2]
    src = open(os.path.join(raiz, "index.html"), encoding="utf-8").read()
    head = re.search(r"<head[\s>].*?</head>", src, re.S).group(0)
    body = re.search(r"<body[^>]*>(.*)</body>", src, re.S).group(1)
    fuentes = re.findall(r"<link[^>]+fonts\.(?:googleapis|gstatic)[^>]*>", head)
    css = re.findall(r'<link[^>]+href="assets/css/[^"]+\.css"[^>]*>', head)
    tema = re.search(r"<script>.*?</script>", head, re.S).group(0).replace("\n      document.documentElement.classList.add('js');", "")

    body = re.sub(r'\s*<!-- =+ INTRO.*?</div>\n  </div>\n', "\n", body, count=1, flags=re.S)
    iframe = re.search(r'<iframe id="map-frame"[^>]*></iframe>', body)
    body = body.replace(iframe.group(0), (
        '<a class="map__static" id="map-static" target="_blank" rel="noopener">'
        '<svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>'
        '<strong data-bind="direccion"></strong><span>Ver la ubicación en Google Maps</span></a>'))

    frag = f"<title>{TITULO}</title>\n" + "\n".join(fuentes + css) + "\n" + tema + "\n" + body.strip() + "\n"
    for malo in ("<!doctype", "<html", "<head", "<body", "<iframe", 'id="intro"'):
        assert not re.search(re.escape(malo) + r"[\s>]", frag, re.I), malo
    open(salida, "w", encoding="utf-8").write(frag)

    files = {}
    for carpeta in ("assets/css", "assets/js"):
        for n in sorted(os.listdir(os.path.join(raiz, carpeta))):
            files[f"{carpeta}/{n}"] = f"{carpeta}/{n}"
    texto = frag + "".join(open(os.path.join(raiz, r), encoding="utf-8").read() for r in list(files))
    for rel in sorted(set(re.findall(r"""(assets/img/[^"'()\s?#<>]+\.(?:png|jpe?g|webp|svg))""", texto))):
        if os.path.isfile(os.path.join(raiz, rel)):
            files[rel] = rel
        else:
            print(f"AVISO: el sitio menciona {rel} pero el archivo no existe", file=sys.stderr)
    total = sum(os.path.getsize(os.path.join(raiz, r)) for r in files)
    grande = [r for r in files if os.path.getsize(os.path.join(raiz, r)) > 15 * 1024 * 1024]
    print(json.dumps(files, ensure_ascii=False, indent=1))
    if grande or total > 64 * 1024 * 1024 or len(files) > 255:
        print("AVISO: se superan los límites de publicación (15 MB por archivo, 64 MB o 255 archivos)", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
