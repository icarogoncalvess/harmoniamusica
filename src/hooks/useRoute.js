import { useEffect, useState } from 'react';

const read = () => window.location.hash.slice(1) || 'home';

/** Roteador mínimo baseado em hash: #home, #import, #song, #learn, #assistant */
export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function navigate(route) {
  window.location.hash = route;
  window.scrollTo(0, 0);
}
