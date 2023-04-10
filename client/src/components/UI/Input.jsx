const Input = ({
  className,
  input,
  label,
  error,
  isSurpriseMe,
  handleSurpriseMe
}) => {
  let errorMessage;

  if (error) {
    errorMessage = <p className="text-emerald-700 text-sm">{error}</p>;
  }

  return (
    <div className={`${className} mb-3`}>
      <div className="flex items-center gap-2 mb-2">
        <label className="block font-medium text-gray-800" htmlFor={input.id}>
          {label}
        </label>
        {isSurpriseMe && (
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="font-semibold text-xs bg-[#ececf1] py-1 px-2 rounded-[5px] text-black"
          >
            Surprise me
          </button>
        )}
      </div>

      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-full p-2 mb-1"
        {...input}
      />
      {errorMessage}
    </div>
  );
};

export default Input;
