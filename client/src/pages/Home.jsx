import { Link } from '../lib/router';
import Notice from '../components/Notice';
import ServiceCard from '../components/ServiceCard';
import useServices from '../components/useServices';

export default function Home() {
  const { services, loading, error, reload } = useServices();

  return (
    <>
      <section className="hero">
        <h1>Sharp looks. Easy booking.</h1>
        <p className="muted">
          Haircuts, grooming, skin, nails and spa by the team at Salon7. Pick a service and book
          your slot online in under a minute.
        </p>
        <Link to="/services" className="btn btn-lg">
          Explore services
        </Link>
      </section>

      <section>
        <h2>Popular treatments</h2>
        {loading && <p className="muted">Loading services…</p>}
        {error && (
          <Notice type="error" title="Could not load services">
            {error}{' '}
            <button className="link" onClick={reload}>
              Retry
            </button>
          </Notice>
        )}
        <div className="grid">
          {services.slice(0, 3).map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      </section>
    </>
  );
}
