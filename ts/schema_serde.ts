import {
  MsgToEngine,
  Point,
  MsgToEngine_DragMove,
  Arrow,
  MsgFromEngine,
  Rectangle
} from "./schema";

import {
  write_u32,
  write_f32,
  seq_writer,
  Sink,
  Serializer,
  read_u32,
  read_f32,
  seq_reader,
  Deserializer
} from "ts-binary";

// Serializers

export const writeRectangle = (
  sink: Sink,
  { x, y, w, h, borderWidth }: Rectangle
): Sink =>
  write_f32(
    write_f32(write_f32(write_f32(write_f32(sink, x), y), w), h),
    borderWidth
  );

const writeVecRectangle: Serializer<Array<Rectangle>> = seq_writer(
  writeRectangle
);

export const writePoint = (sink: Sink, { x, y }: Point): Sink =>
  write_f32(write_f32(sink, x), y);

const ArrowMap: { [key: string]: number } = {
  Left: 0,
  Right: 1,
  Up: 2,
  Down: 3
};

export const writeArrow = (sink: Sink, val: Arrow): Sink =>
  write_u32(sink, ArrowMap[val]);

const writeMsgToEngine_DragMove = (
  sink: Sink,
  val: MsgToEngine_DragMove
): Sink => write_f32(write_f32(sink, val[0]), val[1]);

export const writeMsgToEngine = (sink: Sink, val: MsgToEngine): Sink => {
  switch (val.tag) {
    case "DragStart":
      return writePoint(write_u32(sink, 0), val.value);
    case "DragEnd":
      return writePoint(write_u32(sink, 1), val.value);
    case "DragMove":
      return writeMsgToEngine_DragMove(write_u32(sink, 2), val.value);
    case "IncreaseZoom":
      return write_u32(sink, 3);
    case "DecreaseZoom":
      return write_u32(sink, 4);
    case "NewStep":
      return write_u32(sink, 5);
    case "KeyPress":
      return writeArrow(write_u32(sink, 6), val.value);
    case "RunAnimation":
      return write_u32(sink, 7);
    case "AnimationFrame":
      return write_f32(write_u32(sink, 8), val.value);
  }
};

export const writeMsgFromEngine = (sink: Sink, val: MsgFromEngine): Sink => {
  switch (val.tag) {
    case "Draw":
      return writeVecRectangle(write_u32(sink, 0), val.value);
    case "Nothing":
      return write_u32(sink, 1);
    case "Done":
      return write_u32(sink, 2);
  }
};

// Deserializers

export const readRectangle = (sink: Sink): Rectangle => {
  const x = read_f32(sink);
  const y = read_f32(sink);
  const w = read_f32(sink);
  const h = read_f32(sink);
  const borderWidth = read_f32(sink);
  return { x, y, w, h, borderWidth };
};

const readVecRectangle: Deserializer<Array<Rectangle>> = seq_reader(
  readRectangle
);

export const readPoint = (sink: Sink): Point => {
  const x = read_f32(sink);
  const y = read_f32(sink);
  return { x, y };
};

const ArrowReverseMap: Arrow[] = [
  Arrow.Left,
  Arrow.Right,
  Arrow.Up,
  Arrow.Down
];

export const readArrow = (sink: Sink): Arrow => ArrowReverseMap[read_u32(sink)];

export const readMsgToEngine = (sink: Sink): MsgToEngine => {
  switch (read_u32(sink)) {
    case 0:
      return MsgToEngine.DragStart(readPoint(sink));
    case 1:
      return MsgToEngine.DragEnd(readPoint(sink));
    case 2:
      return MsgToEngine.DragMove(read_f32(sink), read_f32(sink));
    case 3:
      return MsgToEngine.IncreaseZoom;
    case 4:
      return MsgToEngine.DecreaseZoom;
    case 5:
      return MsgToEngine.NewStep;
    case 6:
      return MsgToEngine.KeyPress(readArrow(sink));
    case 7:
      return MsgToEngine.RunAnimation;
    case 8:
      return MsgToEngine.AnimationFrame(read_f32(sink));
  }
  throw new Error("bad variant index for MsgToEngine");
};

export const readMsgFromEngine = (sink: Sink): MsgFromEngine => {
  switch (read_u32(sink)) {
    case 0:
      return MsgFromEngine.Draw(readVecRectangle(sink));
    case 1:
      return MsgFromEngine.Nothing;
    case 2:
      return MsgFromEngine.Done;
  }
  throw new Error("bad variant index for MsgFromEngine");
};
