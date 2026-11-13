import { useMemo, useState } from 'react';
import Notice from '../components/Notice';
import ServiceCard from '../components/ServiceCard';
import useServices from '../components/useServices';

export default function Services() {
  const { services, loading, error, reload } = useServices();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => ['All', ...new Set(services.map((s) => s.category))],
    [services],
  );

  const visible = useMemo(
    () =>
      services.filter(
        (s) =>
          (category === 'All' || s.category === category) &&
          s.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [services, category, query],
  );

  return (
    <>
      <h1>Services &amp; pricing</h1>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search services…"
          aria-label="Search services"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${c === category ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="muted">Loading services…</p>}
      {error && (
        <Notice type="error" title="Could not load services">
          {error}{' '}
          <button className="link" onClick={reload}>
            Retry
          </button>
        </Notice>
      )}
      {!loading && !error && visible.length === 0 && (
        <Notice title="No services found">Try a different search or category.</Notice>
      )}
      <div className="grid">
        {visible.map((s) => (
          <ServiceCard key={s._id} service={s} />
        ))}
      </div>
    </>
  );
}
