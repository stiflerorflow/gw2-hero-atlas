import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
class Boundary extends React.Component<
  { children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="fatal">
        <h1>The notebook needs a reload.</h1>
        <p>
          Your saved profiles have not been reset. Reload to recover, or export
          browser data before clearing anything.
        </p>
        <button onClick={() => location.reload()}>Reload planner</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <Boundary>
    <App />
  </Boundary>,
);
