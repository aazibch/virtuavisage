import Header from './Header';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="sm:p-8 px-4 py-8 w-full bg-[#F9FAFE] min-h-[calc(100vh-73px)]">
        {children}
      </main>
    </>
  );
};

export default Layout;
