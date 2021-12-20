interface State {
  enter(...args: unknown[]): void;
  exit(...args: unknown[]): void;
}
