import { useCallback, useEffect, useMemo, useState } from 'react';
import Notice from '../components/Notice';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';
import { formatPrice } from '../lib/format';

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setBookings(await api.get('/bookings'));
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

  const visible = useMemo(
    () => bookings.filter((b) => filter === 'All' || b.status === filter),
    [bookings, filter],
  );

  const revenue = bookings
    .filter((b) => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.service?.price ?? 0), 0);

  return (
    <>
      <h1>Admin dashboard</h1>
      <div className="stats">
        <div className="panel">
          <span className="muted small">Total bookings</span>
          <strong className="stat">{bookings.length}</strong>
        </div>
        <div className="panel">
          <span className="muted small">Confirmed revenue</span>
          <strong className="stat">{formatPrice(revenue)}</strong>
        </div>
      </div>

      <div className="chips">
        {['All', 'Confirmed', 'Cancelled'].map((s) => (
          <button
            key={s}
            className={`chip ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <Notice type="error">{error}</Notice>}
      {loading && <p className="muted">Loading…</p>}
      {!loading && !error && visible.length === 0 && <Notice title="No bookings to show" />}

      {visible.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Stylist</th>
                <th>When</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b._id}>
                  <td>{b.ref}</td>
                  <td>
                    {b.customerName}
                    <div className="muted small">{b.customerPhone}</div>
                  </td>
                  <td>{b.service?.name}</td>
                  <td>{b.stylist}</td>
                  <td>
                    {b.date} {b.timeSlot}
                  </td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                  <td>
                    {b.status === 'Confirmed' && (
                      <button className="btn btn-outline btn-danger" onClick={() => cancel(b._id)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
