document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal");
  if (!terminal) return console.error("Terminal div not found");

  // Terminal styling
  Object.assign(terminal.style, {
    background: "#000",
    color: "#0f0",
    fontFamily: "monospace",
    padding: "12px",
    height: "300px",
    overflowY: "auto",
    borderRadius: "8px"
  });

  const log = (msg, color = "#0f0") => {
    const line = document.createElement("div");
    line.style.color = color;
    line.textContent = msg;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  };

  const colorFor = (type) => {
    if (type === "success") return "#00ff88";
    if (type === "error") return "#ff4444";
    if (type === "info") return "#ffaa00";
    if (type === "warn") return "#ffcc00";
    return "#0f0";
  };

  log("[WEB] Terminal initialized", "#0ff");

  const WS_URL = "wss://videogenic-theodore-studly.ngrok-free.dev";
  let ws;
  let reconnectTimer;

  function connect() {
    log("[WS] Connecting…", "#888");

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      log("[WS] Connected", "#00ff88");
      clearTimeout(reconnectTimer);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        log(`[${data.time}] ${data.message}`, colorFor(data.type));
      } catch {
        log(event.data);
      }
    };

    ws.onerror = () => {
      log("[WS] Error", "#ff4444");
    };

    ws.onclose = () => {
      log("[WS] Disconnected — retrying in 3s", "#ffaa00");
      reconnectTimer = setTimeout(connect, 3000);
    };
  }

  connect();
});
