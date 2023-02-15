import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import {Rect} from "./components/RectComponent";

function App() {
  const [starterRect, setStarterRect] = useState("");

  async function create_rect(width: number, height: number, pos_x: number, pos_y: number) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
      setStarterRect(await invoke("create_rect", { }));
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!!!</h1>
          <button onClick={(e) => {
              console.log("123");
              create_rect(50, 50, 50, 50);
          }}>Create Rect</button>
      <Rect width={50} height={50} pos_x={50} pos_y={50}></Rect>
    </div>
  );
}

export default App;
