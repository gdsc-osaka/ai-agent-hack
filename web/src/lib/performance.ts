// Performance monitoring utilities
export const performanceMetrics = {
  // Measure performance for critical user interactions
  measureInteraction: (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();

    // Log performance metrics (in production, send to analytics)
    if (process.env.NODE_ENV === "development") {
      console.log(`${name} took ${end - start} milliseconds`);
    }

    // Report to Web Vitals API if available
    if (typeof window !== "undefined" && "webkitPerformance" in window) {
      // Custom metric reporting logic here
    }
  },

  // Debounce function for search inputs
  debounce: <T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    return ((...args: unknown[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;
    return ((...args: unknown[]) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(
          () => {
            func(...args);
            lastExecTime = Date.now();
          },
          delay - (currentTime - lastExecTime)
        );
      }
    }) as T;
  },

  // Lazy load components
  preloadRoute: (route: string) => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = route;
      document.head.appendChild(link);
    }
  },

  // Intersection Observer for lazy loading
  createIntersectionObserver: (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      return new IntersectionObserver(callback, {
        rootMargin: "50px",
        threshold: 0.1,
        ...options,
      });
    }
    return null;
  },
};

// Web Vitals reporting
export const reportWebVitals = (metric: { name: string; value: number }) => {
  if (process.env.NODE_ENV === "production") {
    // Send to analytics service
    console.log(metric);
  }
};
