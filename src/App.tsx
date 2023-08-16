import React, { useState } from "react";
import Editor from "@monaco-editor/react";

import "./App.css";

function App() {
	const [input, setInput] = useState<string | undefined>();
	const [output, setOutput] = useState("");

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
		setInput(value);
	}, []);

	const onRun = () => {
		if (input) {
			(() => {
				try {
					eval(input);
				} catch (error) {
					console.info({ error });
				}
			})();
		}
	};

	const onClear = () => setOutput("");

	return (
		<div className="App">
			<header className="App-header">JS Code Editor</header>

			<Editor
				language="javascript"
				height="60vh"
				onChange={onChange}
				theme="vs-dark"
			/>
			<button onClick={onRun}>Run</button>
			<button onClick={onClear}>Clear Output</button>
			{/* <pre>{output}</pre> */}
			<Editor
				value={output}
				theme="vs-dark"
				height="30vh"
				options={{
					readOnly: true,
				}}
			/>
		</div>
	);
}

export default App;
