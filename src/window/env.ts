const INSPECTOR_KEYS = [
  "VSCODE_INSPECTOR_OPTIONS",
  "NODE_INSPECT_RESUME_ON_START",
  "NODE_OPTIONS",
  "NODE_DEBUG",
  "NODE_UNIQUE_ID",
] as const;

export function windowProcessEnv(source: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const env = { ...source };
  for (const key of INSPECTOR_KEYS) {
    delete env[key];
  }
  return env;
}
