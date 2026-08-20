import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Class component because React error boundaries require the
// componentDidCatch/getDerivedStateFromError lifecycle — there's no hook
// equivalent. Catches render-time errors anywhere below it in the tree so
// one broken component doesn't take down the whole app.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ShopNest crashed:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-state-screen">
          <AlertTriangle size={32} />
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred. You can try reloading this section.</p>
          <button className="btn btn-primary" onClick={this.handleReset}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
