export default function ErrorBox({ message }) {
  if (!message) return null;

  return (
    <div className="p-3 mb-4 border border-red-400 text-red-600 rounded">
      {message}
    </div>
  );
}
