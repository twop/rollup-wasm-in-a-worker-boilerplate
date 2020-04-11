import { MessageToWorker, MessageFromWorker } from "./messages";

const workerAPI = (globalThis ||
  (self as unknown)) as DedicatedWorkerGlobalScope;

import wasm from "../wasm/animatiboard";
import { AppAPI } from "../wasm/animatiboard";

wasm("./animatiboard_bg.wasm")
  .then(() => {
    // here it means that the wasm variable was initialized
    // and we can access it via AppAPI import from the same module
    const wasmpApi = AppAPI.new();

    workerAPI.onmessage = ({ data }) => {
      const msg: MessageToWorker = data;
      switch (msg.tag) {
        case "binary": {
          let arr = new Uint8Array(msg.arr);
          const wasmMemView: Uint8Array = wasmpApi.allocate_space(arr.length);
          wasmMemView.set(arr);
          const responseView: Uint8Array = wasmpApi.handle_message();
          if (arr.length < responseView.length) {
            arr = new Uint8Array(responseView.length);
          }
          arr.set(responseView);
          const reply: MessageFromWorker = {
            tag: "binary",
            arr: arr.buffer,
          };

          postMessage(reply, [arr.buffer]);
          break;
        }
      }
    };

    postMessage("ready");
  })
  .catch(console.error);
