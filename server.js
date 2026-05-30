const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const initSqlJs = require('sql.js');

const app    = express();
const DB_PATH = path.join(__dirname, 'boda.db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ── BASE DE DATOS (sql.js — sin compilar, puro JS) ──
let db;

async function initDB() {
  const SQL = await initSqlJs();
  db = new SQL.Database();

  db.run(`CREATE TABLE IF NOT EXISTS rsvp (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT,
    phone      TEXT,
    guests     INTEGER DEFAULT 0,
    menu       TEXT,
    notes      TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  // Cargar datos guardados si existen
  if (fs.existsSync(DB_PATH)) {
    try {
      const saved = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      saved.forEach(r => {
        db.run(
          'INSERT OR IGNORE INTO rsvp (id,name,email,phone,guests,menu,notes,created_at) VALUES (?,?,?,?,?,?,?,?)',
          [r.id, r.name, r.email, r.phone, r.guests, r.menu, r.notes, r.created_at]
        );
      });
      console.log(`📂 ${saved.length} registros cargados`);
    } catch(e) { console.log('Archivo de datos nuevo'); }
  }
}

function saveDB() {
  const stmt = db.prepare('SELECT * FROM rsvp');
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  fs.writeFileSync(DB_PATH, JSON.stringify(rows, null, 2));
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function queryOne(sql, params = []) {
  return queryAll(sql, params)[0] || null;
}

// ── RUTAS ──
app.post('/api/rsvp', (req, res) => {
  const { name, email, phone, guests, menu, notes } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Nombre requerido' });

  const now = new Date().toLocaleString('es');
  db.run(
    'INSERT INTO rsvp (name,email,phone,guests,menu,notes,created_at) VALUES (?,?,?,?,?,?,?)',
    [name.trim(), email||'', phone||'', guests||0, menu||'', notes||'', now]
  );
  saveDB();
  const last = queryOne('SELECT last_insert_rowid() as id');
  res.json({ ok: true, id: last?.id });
});

app.get('/api/rsvp', (_req, res) => {
  res.json(queryAll('SELECT * FROM rsvp ORDER BY id DESC'));
});

app.get('/api/stats', (_req, res) => {
  const total  = queryOne('SELECT COUNT(*) as n FROM rsvp')?.n || 0;
  const guests = queryOne('SELECT COALESCE(SUM(guests),0) as n FROM rsvp')?.n || 0;
  const menus  = queryAll('SELECT menu, COUNT(*) as n FROM rsvp GROUP BY menu');
  res.json({ confirmados: total, acompanantes: guests, total_asistentes: total + guests, menus });
});

app.delete('/api/rsvp/:id', (req, res) => {
  db.run('DELETE FROM rsvp WHERE id = ?', [req.params.id]);
  saveDB();
  res.json({ ok: true });
});

// ── INICIO ──
const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log('\n✅  Servidor listo en http://localhost:' + PORT);
    console.log('📋  Panel admin:   http://localhost:' + PORT + '/admin.html');
    console.log('\nPresiona Ctrl+C para detener\n');
  });
});
