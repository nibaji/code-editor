import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

import * as nightOwl from "monaco-themes/themes/Night Owl.json";
import "./App.css";

function App() {
	const [input, setInput] = useState<string | undefined>();
	const [output, setOutput] = useState<string | undefined>("");

	let logs: any[] = [];

	console.log = function (...messages) {
		logs.push(messages);
		const messageArray = logs.map((e) => JSON.stringify(e));

		let tempOut = "";
		for (const message of messageArray) {
			console.info(message);

			if (message) {
				tempOut +=
					`${tempOut ? "\n" : ""}` + message.substring(1, message.length - 1);
			}
		}
		setOutput(tempOut);
	};

	const onChange = React.useCallback((value: string | undefined) => {
		if (value) {
			setInput(value);
			localStorage.setItem("js", value);
		}
	}, []);

	const onRun = () => {
		if (input) {
			try {
				const snippet = new Function(input);
				snippet();
			} catch (error) {
				console.info({ error });
			}
		}
	};

	const onClearOutput = () => setOutput("");

	const onClearAll = () => {
		setInput("");
		setOutput("");
	};

	useEffect(() => {
		const savedJs = localStorage.getItem("js");
		if (savedJs) {
			setInput(savedJs);
		}
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				JS Code Editor
				<button onClick={onClearAll} className="error-button">
					Clear All X
				</button>
				<button onClick={onRun}>Run {"</>"}</button>
			</header>

			<Editor
				language="javascript"
				height="60vh"
				onChange={onChange}
				value={input}
				onMount={(_editor, monaco) => {
					monaco.editor.defineTheme("night-owl", nightOwl as any);
					monaco.editor.setTheme("night-owl");
				}}
				options={{
					padding: {
						top: 16,
						bottom: 16,
					},
				}}
			/>
			<div className="console-heading-holder">
				<h5>Console Log</h5>
				<button onClick={onClearOutput} className="error-button">
					Clear Console X
				</button>
			</div>
			{/* <pre>{output}</pre> */}
			<Editor
				language="powershell"
				value={output}
				height="30vh"
				loading
				options={{
					readOnly: true,
					padding: {
						top: 16,
						bottom: 16,
					},
				}}
			/>
		</div>
	);
}

export default App;
