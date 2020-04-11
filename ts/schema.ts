export type MsgToEngine =
  | { tag: "DragStart"; value: Point }
  | { tag: "DragEnd"; value: Point }
  | { tag: "DragMove"; value: MsgToEngine_DragMove }
  | { tag: "IncreaseZoom" }
  | { tag: "DecreaseZoom" }
  | { tag: "NewStep" }
  | { tag: "KeyPress"; value: Arrow }
  | { tag: "RunAnimation" }
  | { tag: "AnimationFrame"; value: number };

export interface MsgToEngine_DragMove {
  0: number;
  1: number;
  length: 2;
}

export module MsgToEngine {
  export const DragStart = (value: Point): MsgToEngine => ({
    tag: "DragStart",
    value
  });

  export const DragEnd = (value: Point): MsgToEngine => ({
    tag: "DragEnd",
    value
  });

  export const DragMove = (p0: number, p1: number): MsgToEngine => ({
    tag: "DragMove",
    value: [p0, p1]
  });

  export const IncreaseZoom: MsgToEngine = { tag: "IncreaseZoom" };

  export const DecreaseZoom: MsgToEngine = { tag: "DecreaseZoom" };

  export const NewStep: MsgToEngine = { tag: "NewStep" };

  export const KeyPress = (value: Arrow): MsgToEngine => ({
    tag: "KeyPress",
    value
  });

  export const RunAnimation: MsgToEngine = { tag: "RunAnimation" };

  export const AnimationFrame = (value: number): MsgToEngine => ({
    tag: "AnimationFrame",
    value
  });
}

export type MsgFromEngine =
  | { tag: "Draw"; value: Array<Rectangle> }
  | { tag: "Nothing" }
  | { tag: "Done" };

export module MsgFromEngine {
  export const Draw = (value: Array<Rectangle>): MsgFromEngine => ({
    tag: "Draw",
    value
  });

  export const Nothing: MsgFromEngine = { tag: "Nothing" };

  export const Done: MsgFromEngine = { tag: "Done" };
}

export enum Arrow {
  Left = "Left",
  Right = "Right",
  Up = "Up",
  Down = "Down"
}

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
  borderWidth: number;
}
