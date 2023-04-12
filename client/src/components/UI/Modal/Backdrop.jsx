const Backdrop = ({ onClick, overlaid }) => {
  let zIndexClass = 'z-10';

  if (overlaid) {
    zIndexClass = 'z-20';
  }

  return (
    <div
      onClick={onClick}
      className={`fixed top-0 left-0 w-full h-screen ${zIndexClass} bg-black/75`}
    ></div>
  );
};

export default Backdrop;
