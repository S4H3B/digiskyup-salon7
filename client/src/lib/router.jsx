import { useEffect, useState } from 'react';

// Minimal hash router: URLs look like /#/services, so no server rewrite rules are needed.
const currentPath = () => window.location.hash.slice(1) || '/';

export function useRoute() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const [pathname, queryString = ''] = path.split('?');
  return { pathname, query: new URLSearchParams(queryString) };
}

export const navigate = (to) => {
  window.location.hash = to;
};

export function Link({ to, children, ...props }) {
  return (
    <a href={`#${to}`} {...props}>
      {children}
    </a>
  );
}

export function Redirect({ to }) {
  useEffect(() => {
    window.location.replace(`#${to}`);
  }, [to]);
  return null;
}
