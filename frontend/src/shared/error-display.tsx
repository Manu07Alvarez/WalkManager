import { ValidationError } from './validation';

export const ErrorDisplay = ({ error }: { error: string | ValidationError[] }) => {
  if (typeof error === 'string') {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  return (
    <ul className="text-red-600 text-sm">
      {error.map((err, idx) => (
        <li key={idx}>{err.message}</li>
      ))}
    </ul>
  );
};