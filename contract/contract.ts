import {
  schema2rust,
  schema2ts,
  Type,
  schema2serde,
} from "ts-rust-bridge-codegen";

import { format } from "prettier";
import * as fs from "fs";
import { join } from "path";

const { Vec, Enum, Union, Struct, F32 } = Type;

const Point = Struct({ x: F32, y: F32 });
const Arrow = Enum("Left", "Right", "Up", "Down");

const MsgToEngine = Union({
  DragStart: Point,
  DragEnd: Point,
  DragMove: [F32, F32],
  IncreaseZoom: null,
  DecreaseZoom: null,
  NewStep: null,
  KeyPress: Arrow,
  RunAnimation: null,
  AnimationFrame: F32,
});

const Rectangle = Struct({ x: F32, y: F32, w: F32, h: F32, borderWidth: F32 });

const MsgFromEngine = Union({
  Draw: Vec(Rectangle),
  Nothing: null,
  Done: null,
});

const schema = { MsgToEngine, MsgFromEngine, Arrow, Point, Rectangle };

const tsCode = schema2ts(schema).join("\n\n");

const rustCode = `
use serde::{Deserialize, Serialize};

${schema2rust(schema).join("\n")}
`;

const tsSerDeCode = `
${schema2serde({
  schema: schema,
  typesDeclarationFile: `./schema`,
}).join("\n\n")}
`;

const pretty = (content: string) =>
  format(content, {
    parser: "typescript",
  });

// save to disc
fs.writeFileSync(join(__dirname, "../ts/schema.ts"), pretty(tsCode));
fs.writeFileSync(join(__dirname, "../src/schema.rs"), rustCode);
fs.writeFileSync(join(__dirname, "../ts/schema_serde.ts"), pretty(tsSerDeCode));
