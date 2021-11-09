import React from 'react';
import Footer from './Footer';
import Header from './Header';

type Props = {
  children: React.ReactNode;
  headerChildren?: React.ReactNode;
};

const Layout = ({ children, headerChildren }: Props) => {
  return (
    <>
      <div className="min-h-screen relative">
        <Header>{headerChildren}</Header>
        {/* keep pb-24 in sync with footer height */}
        <main className="pb-24 m-auto w-full lg:w-2/3">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
