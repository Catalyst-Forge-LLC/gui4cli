const INSPECT_FLAGS = /--inspect(?:-brk|-port)?(?:=\S*)?|--debug(?:-brk)?(?:=\S*)?/g;

export function windowProcessEnv(source: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const env = { ...source };
  delete env.VSCODE_INSPECTOR_OPTIONS;
  delete env.NODE_INSPECT_RESUME_ON_START;

  const nodeOptions = env.NODE_OPTIONS;
  if (nodeOptions) {
    const cleaned = nodeOptions.replace(INSPECT_FLAGS, "").replace(/\s+/g, " ").trim();
    if (cleaned) env.NODE_OPTIONS = cleaned;
    else delete env.NODE_OPTIONS;
  }

  return env;
}
