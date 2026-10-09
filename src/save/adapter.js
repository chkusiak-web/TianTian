// Storage adapter. The game only talks to this, so localStorage can be swapped for files or a server later.
export function memoryBackend() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => void m.set(k, String(v)), removeItem: (k) => void m.delete(k) };
}

export function createAdapter(backend) {
  let b = backend;
  if (!b) {
    try { b = window.localStorage; b.setItem('__t', '1'); b.removeItem('__t'); } catch { b = memoryBackend(); }   // private windows can throw
  }
  return {
    read(key) { try { const t = b.getItem(key); return t == null ? null : JSON.parse(t); } catch { return null; } },
    write(key, value) { try { b.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
    remove(key) { try { b.removeItem(key); } catch { /* ignore */ } }
  };
}
