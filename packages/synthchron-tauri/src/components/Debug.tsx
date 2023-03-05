import { CustomAppBar } from "./CustomAppBar"
import { Offline, Online } from 'react-detect-offline'
import { Typography } from "@mui/material"
import {invoke} from "@tauri-apps/api/tauri";
import {ProcessModel} from "@synthchron/simulator/dist/src";


export const Debug = () => {

	export_model("tester", {
		type: "petri-net",
		nodes: [],
		edges: []
	})

	function export_model(name: string, model: ProcessModel){
		is_connected_to_tauri().then((value: boolean) => {
			if (value) {
				console.log("Connected to tauri.")
				// export to tauri
			} else {
				save_to_local_storage(name, model)
				console.log("Not connected to tauri.")
				// export to local storage
			}
		})

		return true
	}

	function save_to_local_storage(name: string, model: object) {
		// @ts-ignore
		window.localStorage.setItem(name, JSON.stringify(model))
	}

	async function is_connected_to_tauri() {
		try {
			let ping = await invoke("ping")
			console.log("ping:", ping)
			return true;
		} catch (e) {
			return false;
		}
	}

    return (
        <>
            <CustomAppBar />
            Hello World!
            You are <i><Online>online</Online><Offline>offline</Offline></i>
        </>
    )
}