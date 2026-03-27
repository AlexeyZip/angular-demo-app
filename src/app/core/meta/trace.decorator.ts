export function TraceExecution(scope: string) {
  return (_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void => {
    const original = descriptor.value as ((...args: unknown[]) => unknown) | undefined;
    if (typeof original !== 'function') {
      return;
    }

    descriptor.value = function (...args: unknown[]) {
      const started = performance.now();
      try {
        return original.apply(this, args);
      } finally {
        const elapsed = Math.round(performance.now() - started);
        console.debug(`[meta:${scope}] ${String(propertyKey)} executed in ${elapsed}ms`);
      }
    };
  };
}
