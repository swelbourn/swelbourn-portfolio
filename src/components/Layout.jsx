import * as React from 'react';
import { Footer } from './Footer/Footer.component';
import { Nav } from './Nav/Nav.component';

const Layout = ({ className, children }) => {
  return (
    <div className="global-wrapper">
      <Nav />
      <main className={className}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
