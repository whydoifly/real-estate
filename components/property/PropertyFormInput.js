export default function PropertyFormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {type === 'checkbox' ? (
        <div className="flex items-center">
          <label htmlFor={name} className="mr-2">{label}</label>
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value}
            onChange={onChange}
            {...props}
          />
        </div>
      ) : (
        <>
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder || label}
            className={`w-full p-2 bg-gray-600 text-white rounded ${
              error ? 'border-2 border-red-500' : ''
            }`}
            {...props}
          />
          {error && (
            <span className="text-red-500 text-sm mt-1">{error}</span>
          )}
        </>
      )}
    </div>
  );
}
