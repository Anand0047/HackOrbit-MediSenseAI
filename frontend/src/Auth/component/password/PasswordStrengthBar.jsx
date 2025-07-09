export default function PasswordStrengthBar({ checks }) {
  const score = Object.values(checks).filter(Boolean).length;

  const getStrengthDetails = () => {
    if (score <= 2)
      return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (score <= 4)
      return { label: "Medium", color: "bg-yellow-500", width: "w-1/2" };
    if (score === 5)
      return { label: "Strong", color: "bg-green-500", width: "w-3/4" };
    return { label: "Very Strong", color: "bg-blue-500", width: "w-full" };
  };

  const { label, color, width } = getStrengthDetails();

  return (
    <div className="space-y-1 sm:space-y-2">
      <div className="h-1.5 sm:h-2 bg-gray-200 rounded">
        <div className={`${color} ${width} h-full rounded transition-all duration-300`} />
      </div>
      <p className="text-right text-xs sm:text-sm text-gray-600">{label}</p>
    </div>
  );
}
