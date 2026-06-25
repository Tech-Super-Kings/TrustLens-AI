import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 dark:text-white">
    <div>
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
      <Link to="/" className="primary-button mt-8">Return home</Link>
    </div>
  </div>
);
