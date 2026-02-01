export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-6">
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
