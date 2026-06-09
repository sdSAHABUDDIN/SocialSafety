import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Python script
const PYTHON_SCRIPT = path.join(__dirname, "../ml/predict.py");

export const predictHealth = ({ heartRate, temperature, motion }) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [
      PYTHON_SCRIPT,
      heartRate,
      temperature,
      motion,
    ]);

    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    python.on("close", () => {
      const prediction = parseInt(result.trim());
      if (isNaN(prediction)) {
        reject("Invalid ML response");
      } else {
        resolve(prediction);
      }
    });
  });
};
