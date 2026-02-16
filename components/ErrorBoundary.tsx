import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ShonaAI Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white flex items-center justify-center p-6">
                    <div className="text-center max-w-sm">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">😔</span>
                        </div>
                        <h2 className="text-2xl font-bold text-stone-900 mb-2">
                            Pane dambudziko! (There's a problem!)
                        </h2>
                        <p className="text-stone-500 mb-6">
                            ShonaAI encountered an unexpected error. Please try refreshing.
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="px-8 py-3 bg-zim-green text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                        >
                            Edza Zvakare (Try Again)
                        </button>
                        {this.state.error && (
                            <p className="mt-4 text-xs text-stone-400 font-mono bg-stone-50 p-3 rounded-lg">
                                {this.state.error.message}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
