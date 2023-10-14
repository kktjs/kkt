import { FC, PropsWithChildren } from 'react';
import { Outlet, ScrollRestoration, NavLink } from 'react-router-dom';

export const Component: FC<PropsWithChildren> = () => {
  return (
    <div>
      <header>
        <h1>KKT</h1>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
};
