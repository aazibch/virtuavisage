const Backdrop = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="fixed top-0 left-0 w-full h-screen z-10 bg-black/75"
    ></div>
  );
};

export default Backdrop;
