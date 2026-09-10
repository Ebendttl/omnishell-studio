export interface ConsoleLogEntry {
  id: string;
  type: "log" | "warn" | "error" | "result" | "system";
  content: string;
  timestamp: string;
}

export interface ExecutionResult {
  success: boolean;
  returnValue: unknown;
  logs: ConsoleLogEntry[];
  executionTimeMs: number;
  error?: string;
}

// Persistent execution scope context for REPL session
const globalScopeContext: Record<string, unknown> = {};

/**
 * Safe client-side JavaScript execution engine.
 * Evaluates code in isolation while capturing console output stream.
 */
export function executeJsRepl(code: string, clearScope = false): ExecutionResult {
  if (clearScope) {
    Object.keys(globalScopeContext).forEach((key) => delete globalScopeContext[key]);
  }

  const logs: ConsoleLogEntry[] = [];
  const startTime = performance.now();

  const getTimestamp = () => new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });

  // Custom formatted logger
  const formatArg = (arg: unknown): string => {
    if (typeof arg === "undefined") return "undefined";
    if (arg === null) return "null";
    if (typeof arg === "object") {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  };

  const customConsole = {
    log: (...args: unknown[]) => {
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "log",
        content: args.map(formatArg).join(" "),
        timestamp: getTimestamp(),
      });
    },
    warn: (...args: unknown[]) => {
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "warn",
        content: args.map(formatArg).join(" "),
        timestamp: getTimestamp(),
      });
    },
    error: (...args: unknown[]) => {
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "error",
        content: args.map(formatArg).join(" "),
        timestamp: getTimestamp(),
      });
    },
  };

  try {
    // Construct execution sandbox function with custom scope & console
    const scopeKeys = Object.keys(globalScopeContext);
    const scopeValues = Object.values(globalScopeContext);

    // Create execution wrapper
    const runnerFunction = new Function(
      "console",
      "scope",
      ...scopeKeys,
      `
      "use strict";
      try {
        ${code}
      } catch (err) {
        throw err;
      }
      `
    );

    const returnValue = runnerFunction(customConsole, globalScopeContext, ...scopeValues);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    if (typeof returnValue !== "undefined") {
      logs.push({
        id: Math.random().toString(36).substring(2, 9),
        type: "result",
        content: `⇒ ${formatArg(returnValue)}`,
        timestamp: getTimestamp(),
      });
    }

    return {
      success: true,
      returnValue,
      logs,
      executionTimeMs,
    };
  } catch (err: unknown) {
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    const errorMessage = err instanceof Error ? err.message : String(err);

    logs.push({
      id: Math.random().toString(36).substring(2, 9),
      type: "error",
      content: `Uncaught Error: ${errorMessage}`,
      timestamp: getTimestamp(),
    });

    return {
      success: false,
      returnValue: undefined,
      logs,
      executionTimeMs,
      error: errorMessage,
    };
  }
}
