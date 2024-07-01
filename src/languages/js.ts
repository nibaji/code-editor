export default function JS(input: string) {
  let logs: any[] = [];
  let output = "";

  //polyfill
  console.log = function (...messages) {
    logs.push(messages);
  };

  try {
    const snippet = new Function(input);
    snippet();
  } catch (error) {
    console.info({ error });
    output = JSON.stringify({ error });
  } finally {
    for (let log of logs) {
      if (log) {
        log = JSON.stringify(log);
        log = log.substring(1, log.length - 1);
        output += `${output ? "\n" : ""}` + log;
      }
    }
    return output;
  }
}
