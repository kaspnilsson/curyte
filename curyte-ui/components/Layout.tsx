import Head from 'next/head';
import React from 'react';
// import Alert from './alert';
import Footer from './Footer';
import Header from './Header';

type Props = {
  preview?: boolean;
  children: React.ReactNode;
};

const Layout = ({ preview, children }: Props) => {
  return (
    <>
      <div className="min-h-screen relative">
        <Header />
        {/* keep pb-24 in sync with footer height */}
        <main className="pb-24 m-auto w-full lg:w-2/3">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
