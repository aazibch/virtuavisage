const Backdrop = ({ onClick, zIndex }) => {
  let zIndexClass = 'z-10';

  if (zIndex) {
    zIndexClass = `z-${zIndex}`;
  }

  return (
    <div
      onClick={onClick}
      className={`fixed top-0 left-0 w-full h-screen ${zIndexClass} bg-black/75`}
    ></div>
  );
};

export default Backdrop;
