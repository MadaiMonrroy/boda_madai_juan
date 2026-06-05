const express = require('express');
const cors    = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.post('/api/rsvp', async (req, res) => {
  const { name, email, phone, guests, menu, notes } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Nombre requerido' });

  const { data, error } = await supabase
    .from('rsvp')
    .insert([{ name: name.trim(), email: email||'', phone: phone||'', guests: guests||0, menu: menu||'', notes: notes||'' }])
    .select('id')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, id: data.id });
});

app.get('/api/rsvp', async (_req, res) => {
  const { data, error } = await supabase
    .from('rsvp')
    .select('*')
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/stats', async (_req, res) => {
  const { data, error } = await supabase.from('rsvp').select('*');
  if (error) return res.status(500).json({ error: error.message });

  const total  = data.length;
  const guests = data.reduce((sum, r) => sum + (r.guests || 0), 0);
  const menuCounts = {};
  data.forEach(r => { menuCounts[r.menu] = (menuCounts[r.menu] || 0) + 1; });
  const menus = Object.entries(menuCounts).map(([menu, n]) => ({ menu, n }));

  res.json({ confirmados: total, acompanantes: guests, total_asistentes: total + guests, menus });
});

app.delete('/api/rsvp/:id', async (req, res) => {
  const { error } = await supabase.from('rsvp').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor listo en puerto ' + PORT));
