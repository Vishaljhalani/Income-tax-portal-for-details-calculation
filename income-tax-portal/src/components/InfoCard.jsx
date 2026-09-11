import { Link } from 'react-router-dom';

export default function InfoCard({ title, description, route, badge,link }){



  const content = (
    <>
      {badge && <span className="card-badge">{badge}</span>}
      <h3>{title}</h3>
      <p>{description}</p>
      {route && <span className="card-link">Explore →</span>}
    </>
  );

  if (route) {
    return (
      <Link to={route} className="info-card clickable-card">
        {content}
      </Link>
    );
  }

  return <article className="info-card">{content}</article>;
}