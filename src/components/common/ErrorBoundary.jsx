import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Global Error Boundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
            <span className="font-serif text-2xl font-bold tracking-widest text-amber-400">K</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest uppercase mb-3">
            KOCHEE FRAGRANCE
          </h1>
          <p className="text-neutral-400 text-sm max-w-md mb-8 leading-relaxed">
            The boutique storefront is refreshing its luxury inventory catalog. Please tap below to resume.
          </p>
          <button
            onClick={this.handleReload}
            className="px-8 py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-lg active:scale-95"
          >
            Refresh Storefront
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

