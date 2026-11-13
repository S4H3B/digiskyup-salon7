import { Link } from '../lib/router';
import { formatPrice } from '../lib/format';

export default function ServiceCard({ service }) {
  return (
    <article className="card">
      {service.imageUrl && (
        <img src={service.imageUrl} alt={service.name} loading="lazy" className="card-img" />
      )}
      <div className="card-body">
        <span className="tag">{service.category}</span>
        <h3>{service.name}</h3>
        <p className="muted small">{service.description}</p>
        <div className="card-foot">
          <div>
            <strong>{formatPrice(service.price)}</strong>
            <span className="muted small"> · {service.durationMin} min</span>
          </div>
          <Link to={`/book/${service._id}`} className="btn">
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}
