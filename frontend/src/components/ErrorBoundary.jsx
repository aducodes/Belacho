import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so fallback UI will be shown
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You could send error logs to a monitoring service here
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600">
            Oops! Something went wrong.
          </h2>
          <p className="text-gray-600">
            Please try refreshing the page or going back to Home.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={() => window.location.href = "/"}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
