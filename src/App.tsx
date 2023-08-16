import React, { useState } from "react";
import Editor from "@monaco-editor/react";

import "./App.css";

function App() {
	const [input, setInput] = useState<string | undefined>();
	const [output, setOutput] = useState("");

	console.log = function (message) {
		console.info();
		console.info(message);
		if (message) {
			if (typeof message === "object") {
				const stringifiedMessage = JSON.stringify(message);
				setOutput(output + "\n" + stringifiedMessage);
			} else setOutput(output + "\n" + message);
		}
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
					console.log({ error });
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
			<Editor value={output} theme="vs-dark" height="30vh" />
		</div>
	);
}

export default App;
