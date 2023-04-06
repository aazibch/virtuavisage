const NotFoundPage = () => {
  return (
    <div className="text-emerald-700 flex items-center justify-center flex-col h-80">
      <div>
        <h1 className="inline-block mr-5 pr-5 text-md font-semibold align-top leading-[3rem] border-r">
          404
        </h1>
        <div className="inline-block text-left">
          <h2 className="font-semibold leading-[3rem]">Page not found.</h2>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
