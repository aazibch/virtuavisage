const Input = ({ className, input, label, error }) => {
  let errorMessage;

  if (error) {
    errorMessage = <p className="text-emerald-700 text-sm">{error}</p>;
  }

  return (
    <div className={`${className} mb-3`}>
      <label className="block mb-2 text-gray-800" htmlFor={input.id}>
        {label}
      </label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-full p-2 mb-1"
        {...input}
      />
      {errorMessage}
    </div>
  );
};

export default Input;
