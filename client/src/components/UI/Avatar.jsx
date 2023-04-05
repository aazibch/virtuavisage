const Avatar = ({ className, content, size }) => {
  let sizeClasses = 'w-7 h-7 text-sm font-semibold';

  if (size === 'large') {
    sizeClasses = 'w-[4rem] h-[4rem] text-4xl font-medium';
  }

  return (
    <div
      className={`${className} ${sizeClasses} rounded-full object-cover bg-neutral-700 flex justify-center items-center text-white`}
    >
      {content}
    </div>
  );
};

export default Avatar;
