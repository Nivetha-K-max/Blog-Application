import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>That page does not exist.</p>
      <Link className="button" to="/">Back home</Link>
    </section>
  );
}
