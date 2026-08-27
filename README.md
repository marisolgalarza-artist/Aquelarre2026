# Aquelarre2026

Realidad Aumentada para pinturas. Cada cuadro es una experiencia AR
independiente (imagen -> efecto animado + audio), armada con
[A-Frame](https://aframe.io/) + [MindAR](https://hiukim.github.io/mind-ar-js-doc/).

No hay build ni npm: es HTML estático puro, servible desde cualquier hosting
estático (GitHub Pages, Netlify, etc.) o abrible directo en el navegador.

## Estructura

```
shared/
  ar-engine.js    lógica genérica: overlay de "toca para empezar",
                  desbloqueo de audio, listeners targetFound/targetLost.
                  No cambia entre cuadros.
  ar-styles.css   estilos del overlay, compartidos.

paintings/
  <cuadro>/
    index.html    escena de A-Frame + config visual propia del cuadro
    marker.mind   target compilado de MindAR para esa pintura
    <asset>.webp  imagen/sprite del efecto (fuego, humo, etc.)
    <asset>.mp3   audio del ritual de ese cuadro
```

Cada carpeta en `paintings/` es una página independiente con su propio link/QR.

## Añadir un cuadro nuevo

1. Fotografía la pintura y compílala con el
   [compilador de MindAR](https://hiukim.github.io/mind-ar-js-doc/tools/compile)
   para obtener su `marker.mind`.
2. Copia `paintings/aquelarre/` a `paintings/<nombre-del-cuadro>/`.
3. Reemplaza `marker.mind`, la imagen del efecto y el audio por los del
   cuadro nuevo.
4. En su `index.html`, ajusta:
   - `imageTargetSrc` (si le cambiaste el nombre al `.mind`)
   - el `src` de `#fuegoImg` (o el asset que uses) y el texto del overlay
   - la animación del `<a-plane>` si el efecto visual es distinto
5. No toques nada en `shared/` — esa lógica ya sirve para cualquier cuadro.

## Probar en local

MindAR necesita pedir la cámara (`getUserMedia`), y eso el navegador solo lo
permite en un "contexto seguro": `https://` o `http://localhost`. Abrir el
`index.html` como archivo (`file://`) o cargar `marker.mind`/los assets así
no funciona (fetch de `file://` falla) y una IP local por `http://` sin
`localhost` tampoco activa la cámara.

1. Servir la carpeta del cuadro por HTTP:

   ```bash
   cd paintings/aquelarre
   python3 -m http.server 8080
   # alternativa: npx serve .
   ```

2. **Probar en el navegador del laptop** (rápido, sin celular):
   abrir `http://localhost:8080`. Sirve para revisar que la escena carga,
   que no hay 404 de `marker.mind`/imagen/audio, y que el overlay +
   desbloqueo de audio funcionan. Para probar el tracking real, apunta la
   webcam a la pintura (impresa o en otra pantalla).

3. **Probar en el celular** (para validar la experiencia real con su cámara):
   el celular no puede usar `localhost`, así que hay que exponer ese
   servidor por HTTPS. Con el `http-server` corriendo, en otra terminal:

   ```bash
   npx localtunnel --port 8080
   # o: ngrok http 8080
   ```

   Eso da una URL `https://...` pública y temporal — ábrela desde el
   celular, acepta el permiso de cámara, y apunta a la pintura.
