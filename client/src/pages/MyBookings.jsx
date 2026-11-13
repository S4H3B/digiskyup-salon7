import { useCallback, useEffect, useState } from 'react';
import { Link } from '../lib/router';
import Notice from '../components/Notice';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBookings(await api.get('/bookings/mine'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>My bookings</h1>
      {error && <Notice type="error">{error}</Notice>}
      {loading && <p className="muted">Loading…</p>}
      {!loading && !error && bookings.length === 0 && (
        <Notice title="No bookings yet">
          <Link to="/services">Browse services</Link> to book your first appointment.
        </Notice>
      )}
      <div className="list">
        {bookings.map((b) => (
          <article key={b._id} className="panel row">
            <div>
              <strong>{b.service?.name}</strong>
              <div className="muted small">
                {b.date} at {b.timeSlot} · {b.stylist} · Ref {b.ref}
              </div>
            </div>
            <div className="row-actions">
              <StatusBadge status={b.status} />
              {b.status === 'Confirmed' && (
                <button className="btn btn-outline btn-danger" onClick={() => cancel(b._id)}>
                  Cancel
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
