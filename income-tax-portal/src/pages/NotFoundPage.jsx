import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="content-section">
      <div className="container narrow-content">
        <div className="coming-soon-box">
          <span className="coming-badge">404</span>
          <h3>Page not found</h3>
          <p>The page you are looking for does not exist.</p>
          <Link to="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}