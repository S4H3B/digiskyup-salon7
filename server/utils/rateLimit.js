// Tiny in-memory rate limiter (per IP). Good enough for one server instance.
export function rateLimit({ windowMs, max, message }) {
  const hits = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, rec] of hits) if (rec.reset < now) hits.delete(key);
  }, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const rec = hits.get(req.ip);
    if (!rec || rec.reset < now) {
      hits.set(req.ip, { count: 1, reset: now + windowMs });
      return next();
    }
    rec.count += 1;
    if (rec.count > max) return res.status(429).json({ message });
    return next();
  };
}
