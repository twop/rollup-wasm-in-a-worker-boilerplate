import { MessageFromWorker, MessageToWorker } from "./messages";
import { MsgFromEngine, MsgToEngine } from "./schema";
import { Sink } from "ts-binary";
import { readMsgFromEngine, writeMsgToEngine } from "./schema_serde";

const worker = new Worker("./worker.ts", { type: "module" });

const handshake = () => {
  worker.onmessage = function onWorkerReady({ data }) {
    if (data !== "ready") {
      return;
    }

    worker.removeEventListener("message", onWorkerReady);

    start();
  };
};

const start = () => {
  worker.onmessage = function msgListener({ data }) {
    const msg: MessageFromWorker = data;
    const sink = Sink(msg.arr);
    handleWorkerEvent(readMsgFromEngine(sink));
  };

  const initialMessageBuf = writeMsgToEngine(
    Sink(new ArrayBuffer(1024)),
    MsgToEngine.NewStep
  ).view.buffer;

  const initialMsg: MessageToWorker = {
    tag: "binary",
    arr: initialMessageBuf,
  };
  worker.postMessage(initialMsg, [initialMessageBuf]);
};

const handleWorkerEvent = (ev: MsgFromEngine) => {
  console.log(ev);
};

handshake();
