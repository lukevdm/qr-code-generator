import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [level, setLevel] = useState("M");
  const [darkMode, setDarkMode] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = localStorage.getItem("darkMode");
    setDarkMode(stored !== null ? stored === "true" : mediaQuery.matches);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const downloadQR = () => {
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const img = new Image();

    const padding = 32; // white border in pixels
    const qrSize = 256;
    const size = qrSize + padding * 2;

    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Fill background with white
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the QR code centered with padding
      context.drawImage(img, padding, padding, qrSize, qrSize);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = url;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        background: darkMode ? "#1f2937" : "#f3f4f6",
        color: darkMode ? "#f3f4f6" : "#111827"
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>QR Code Generator</h1>

      <button
        onClick={toggleDarkMode}
        style={{
          marginBottom: "1rem",
          padding: "0.4rem 0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #ccc",
          background: darkMode ? "#374151" : "#e5e7eb",
          color: darkMode ? "#f3f4f6" : "#111827"
        }}
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <input
          style={{
            padding: "0.5rem",
            width: "100%",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #ccc"
          }}
          placeholder="Enter text or URL..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #ccc"
          }}
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>

        {text && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                background: "#ffffff",
                padding: "1rem",
                borderRadius: "1rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              <QRCode value={text} size={256} level={level} ref={svgRef} />
            </div>
            <button
              onClick={downloadQR}
              style={{
                padding: "0.5rem 1rem",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "0.5rem"
              }}
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
