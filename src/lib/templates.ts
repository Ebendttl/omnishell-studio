export interface CodeTemplate {
  id: string;
  name: string;
  category: "Algorithms" | "Async API" | "State Machines" | "Data Specs";
  description: string;
  code: string;
}

export const CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: "algo-quick-sort",
    name: "QuickSort Visualization",
    category: "Algorithms",
    description: "In-place array partitioning algorithm with step execution logs.",
    code: `// QuickSort Algorithm Execution & Benchmark
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}

const rawData = Array.from({ length: 15 }, () => Math.floor(Math.random() * 100));
console.log("Unsorted Dataset:", rawData);

const sorted = quickSort(rawData);
console.log("Sorted Output:", sorted);
return { count: sorted.length, min: sorted[0], max: sorted[sorted.length - 1] };`
  },
  {
    id: "async-fetcher",
    name: "Async API Retry Engine",
    category: "Async API",
    description: "Resilient exponential backoff fetch engine pattern.",
    code: `// Async Exponential Backoff Simulation
async function fetchWithRetry(taskName, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    console.log(\`Attempt \${attempt} for \${taskName}...\`);
    const success = Math.random() > 0.4;
    
    if (success) {
      console.log(\`Task \${taskName} succeeded on attempt \${attempt}!\`);
      return { status: "OK", attempts: attempt };
    }
    
    const delay = Math.pow(2, attempt) * 100;
    console.warn(\`Attempt \${attempt} failed. Retrying in \${delay}ms...\`);
    await new Promise(res => setTimeout(res, delay));
  }
  
  throw new Error(\`Task \${taskName} failed after \${maxRetries} attempts.\`);
}

fetchWithRetry("SyncDatabaseIndex")
  .then(res => console.log("Final Result:", res))
  .catch(err => console.error("Pipeline Failed:", err.message));`
  },
  {
    id: "state-machine",
    name: "Finite State Machine",
    category: "State Machines",
    description: "Lightweight event transition engine with step validation.",
    code: `// Finite State Machine (FSM) Pattern
class DeploymentFSM {
  constructor() {
    this.state = "IDLE";
    this.history = ["IDLE"];
  }

  transition(event) {
    const transitions = {
      IDLE: { BUILD: "BUILDING" },
      BUILDING: { SUCCESS: "TESTING", FAIL: "FAILED" },
      TESTING: { PASS: "DEPLOYED", FAIL: "FAILED" },
      DEPLOYED: { ROLLBACK: "IDLE" },
      FAILED: { RETRY: "BUILDING" }
    };

    const nextState = transitions[this.state]?.[event];
    if (!nextState) {
      console.warn(\`Invalid transition from \${this.state} via event \${event}\`);
      return false;
    }

    console.log(\`FSM Transition: \${this.state} -> \${nextState} [\${event}]\`);
    this.state = nextState;
    this.history.push(nextState);
    return true;
  }
}

const fsm = new DeploymentFSM();
fsm.transition("BUILD");
fsm.transition("SUCCESS");
fsm.transition("PASS");
console.log("Full Transition Trace:", fsm.history);
return fsm.state;`
  },
  {
    id: "schema-validator",
    name: "Data Schema Validator",
    category: "Data Specs",
    description: "Strict payload object key and type checker.",
    code: `// Lightweight Runtime Schema Validator
function validatePayload(data, schema) {
  const errors = [];
  for (const [key, expectedType] of Object.entries(schema)) {
    if (!(key in data)) {
      errors.push(\`Missing required property: \${key}\`);
    } else if (typeof data[key] !== expectedType) {
      errors.push(\`Invalid type for \${key}: expected \${expectedType}, got \${typeof data[key]}\`);
    }
  }
  return { valid: errors.length === 0, errors };
}

const userSchema = { id: "number", username: "string", active: "boolean" };
const testData = { id: 101, username: "dev_user", active: "true" };

const report = validatePayload(testData, userSchema);
if (!report.valid) {
  console.warn("Validation Warning Report:", report.errors);
} else {
  console.log("Validation Passed!");
}
return report;`
  }
];

export const SYSTEM_PROMPTS = [
  {
    id: "pair-programmer",
    title: "Senior Pair Programmer",
    description: "Provides concise, efficient, production grade TypeScript code snippets.",
    prompt: "You are a World-Class AI Pair Programmer inside OmniShell Studio. Provide ultra-clean, modern, type-safe TypeScript/JavaScript code solutions with brief explanations. Avoid fluff."
  },
  {
    id: "architecture-coach",
    title: "System Architect",
    description: "Focuses on scalable design patterns, state management, and edge performance.",
    prompt: "You are a Lead Systems Architect. Critique user code for performance bottlenecks, state race conditions, and architectural elegance."
  },
  {
    id: "code-debugger",
    title: "Precision Debugger",
    description: "Analyzes console logs, stack traces, and runtime exceptions.",
    prompt: "You are an Expert Debugger. Identify root causes of JavaScript runtime bugs and provide exact fix diffs."
  }
];
