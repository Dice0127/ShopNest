import { Compass } from "lucide-react";

export default function NotFound({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="app-state-screen">
      <Compass size={32} />
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <button className="btn btn-primary" onClick={onGoHome}>Back to home</button>
    </div>
  );
}
