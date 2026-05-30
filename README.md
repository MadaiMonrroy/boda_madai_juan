# 💒 Invitación de Boda — Sofía & Mateo

## 📁 Estructura del proyecto

```
boda/
├── index.html        ← La invitación (abre en el browser)
├── admin.html        ← Panel para ver confirmaciones
├── server.js         ← Servidor backend (Node.js)
├── package.json      ← Dependencias
├── boda.db           ← Base de datos (se crea automático)
└── assets/
    ├── musica.mp3    ← PON AQUÍ TU CANCIÓN
    └── fotos/
        ├── pareja.jpg   ← Foto principal (portada)
        ├── iglesia.jpg  ← Foto del lugar de ceremonia
        ├── hacienda.jpg ← Foto del lugar de celebración
        ├── foto1.jpg    ← Fotos del strip inferior
        ├── foto2.jpg
        └── foto3.jpg
```

---

## 🚀 Instalación paso a paso (Windows)

### 1. Instalar Node.js
- Ve a **https://nodejs.org**
- Descarga el botón verde **LTS**
- Ejecuta el instalador → Next → Next → Install
- Abre CMD y verifica:
  ```
  node -v
  npm -v
  ```

### 2. Crear la carpeta del proyecto
```bash
mkdir C:\boda
cd C:\boda
```

### 3. Copiar los archivos
Copia todos los archivos de este proyecto dentro de `C:\boda`

### 4. Instalar dependencias
```bash
cd C:\boda
npm install
```

### 5. Arrancar el servidor
```bash
node server.js
```

### 6. Abrir en el browser
- **Invitación:** http://localhost:3000
- **Panel admin:** http://localhost:3000/admin.html

---

## 🎵 Agregar música

1. Consigue un archivo MP3 de la canción (ej: desde YouTube con un conversor)
2. Renómbralo a `musica.mp3`
3. Ponlo en la carpeta `assets/`
4. La música sonará automáticamente al cargar la página

---

## 🖼️ Agregar fotos

En `index.html`, busca los comentarios como:
```html
<!-- <img src="assets/fotos/pareja.jpg" alt="Sofía y Mateo"> -->
```
Descomenta la línea `<img>` y comenta o elimina el div `.photo-placeholder` que está abajo.

---

## ✏️ Personalizar nombres y fecha

Busca en `index.html`:
- `Sofía` y `Mateo` → reemplaza con los nombres reales
- `15 · XI · 2026` → cambia la fecha
- `Catedral Metropolitana` → nombre real de la iglesia
- `Hacienda Los Olivos` → nombre real del salón
- `Plaza Mayor s/n` → dirección real
- Los links de Google Maps → reemplaza `https://maps.google.com` con links reales

---

## 🗄️ Base de datos

Se usa **SQLite** (no necesitas instalar nada extra).
El archivo `boda.db` se crea automáticamente al iniciar el servidor.

Para ver las confirmaciones:
- Abre **http://localhost:3000/admin.html**
- Se actualiza automáticamente cada 30 segundos

---

## 🌐 Para que otros puedan ver la invitación

Si quieres compartirla en internet (no solo en tu computadora):
- **Opción gratuita fácil:** Sube a [Railway.app](https://railway.app) o [Render.com](https://render.com)
- Ambas son gratuitas y soportan Node.js + SQLite

---

## 🛑 Detener el servidor
Presiona `Ctrl + C` en la ventana CMD donde está corriendo.
