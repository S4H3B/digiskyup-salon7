import { useEffect, useState } from 'react';
import { Link } from '../lib/router';
import Notice from '../components/Notice';
import { api } from '../lib/api';
import { formatPrice, todayISO } from '../lib/format';

export default function Book({ serviceId }) {
  const [service, setService] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [stylist, setStylist] = useState('');
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState('');
  const [booked, setBooked] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    Promise.all([api.get(`/services/${serviceId}`), api.get('/meta')])
      .then(([svc, m]) => {
        setService(svc);
        setMeta(m);
        setStylist(m.stylists[0]);
      })
      .catch((err) => setLoadError(err.message));
  }, [serviceId]);

  useEffect(() => {
    if (!stylist || !date) return undefined;
    let cancelled = false;
    setSlotsLoading(true);
    setSlot('');
    api
      .get(`/bookings/slots?stylist=${encodeURIComponent(stylist)}&date=${date}`)
      .then((data) => {
        if (!cancelled) setBooked(data.booked);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [stylist, date]);

  const confirm = async () => {
    setError('');
    if (!date || date < todayISO()) return setError('Please choose a valid date.');
    if (!slot) return setError('Please choose a time slot.');

    setBusy(true);
    try {
      setConfirmed(
        await api.post('/bookings', { serviceId: service._id, stylist, date, timeSlot: slot }),
      );
    } catch (err) {
      setError(err.message);
      if (err.status === 409) setBooked((prev) => [...prev, slot]);
    } finally {
      setBusy(false);
    }
  };

  if (loadError)
    return (
      <Notice type="error" title="Could not load booking page">
        {loadError}
      </Notice>
    );
  if (!service || !meta) return <p className="muted">Loading…</p>;

  if (confirmed) {
    return (
      <div className="panel narrow center">
        <h1>Booking confirmed ✓</h1>
        <p>
          Reference <strong>{confirmed.ref}</strong>
        </p>
        <p className="muted">
          {service.name} with {confirmed.stylist}
          <br />
          {confirmed.date} at {confirmed.timeSlot}
        </p>
        <Link to="/my-bookings" className="btn">
          View my bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="panel">
      <h1>Book: {service.name}</h1>
      <p className="muted">
        {formatPrice(service.price)} · {service.durationMin} min
      </p>
      {error && <Notice type="error">{error}</Notice>}

      <label className="field">
        <span>Stylist</span>
        <select value={stylist} onChange={(e) => setStylist(e.target.value)}>
          {meta.stylists.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Date</span>
        <input
          type="date"
          value={date}
          min={todayISO()}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <div className="field">
        <span>Time slot {slotsLoading && <em className="muted small">(checking…)</em>}</span>
        <div className="slots">
          {meta.timeSlots.map((t) => {
            const taken = booked.includes(t);
            return (
              <button
                key={t}
                type="button"
                disabled={taken || slotsLoading}
                className={`chip ${slot === t ? 'active' : ''}`}
                onClick={() => setSlot(t)}
                title={taken ? 'Already booked' : ''}
              >
                {t}
                {taken && ' (booked)'}
              </button>
            );
          })}
        </div>
      </div>

      <button className="btn btn-block" onClick={confirm} disabled={busy}>
        {busy ? 'Booking…' : 'Confirm booking'}
      </button>
    </div>
  );
}
