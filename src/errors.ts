export class Gui4CliError extends Error {
  readonly detail?: string;

  constructor(message: string, detail?: string) {
    super(message);
    this.name = "Gui4CliError";
    this.detail = detail;
  }
}

export function formatUserError(error: unknown): string {
  if (error instanceof Gui4CliError) {
    return error.detail ? `${error.message}\n${error.detail}` : error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
