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
    <div style={{height: "100%", width: "100%", paddingTop: "0px"}} className="container">
        <div
        style={{
            position: "fixed",
            height: "100%",
            left: "0px",
            background: "gray",
            width: "200px"
        }}
        >
            <h1>Actions</h1>
            <button onClick={(e) => {
                create_rect(50, 50, 50, 50);
            }}>Create Rect</button>
        </div>
        <div style={{
            background: "blue"
        }} id="graph">
            <Rect width={50} height={50} pos_x={500} pos_y={500}></Rect>
        </div>
    </div>
  );
}

export default App;
