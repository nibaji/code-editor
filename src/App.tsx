import React, { useState } from "react";
import Editor from "@monaco-editor/react";

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
		setInput(value);
	}, []);

	const onRun = () => {
		if (input) {
			(() => {
				try {
					const snippet = new Function(input);
					snippet();
				} catch (error) {
					console.info({ error });
				}
			})();
		}
	};

	const onClear = () => setOutput("");

	return (
		<div className="App">
			<header className="App-header">
				JS Code Editor
				<button onClick={onRun}>Run {"< />"}</button>
			</header>

			<Editor
				language="javascript"
				height="60vh"
				onChange={onChange}
				theme="vs-dark"
				options={{
					padding: {
						top: 16,
						bottom: 16,
					},
				}}
			/>
			{/* <pre>{output}</pre> */}
			<div className="console-heading-holder">
				<h5>Console Log</h5>
				<button onClick={onClear}>Clear Console X</button>
			</div>
			<Editor
				value={output}
				theme="vs-dark"
				height="30vh"
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
