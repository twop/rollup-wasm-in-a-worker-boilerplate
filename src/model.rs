// type alias Model =
//     { rects : List Shape
//     , currentRect : Maybe ( Rect, Shape )
//     , zoom : Float
//     , shift : Shift
//     , snapshots : List Snapshot
//     , animating : Maybe Int
//     }

use crate::schema::{MsgFromEngine, MsgToEngine, Rectangle};

pub struct Rect {
    x: f32,
    y: f32,
    w: f32,
    h: f32,
}

pub struct Shift {
    dx: f32,
    dy: f32,
}

pub struct Step {
    rects: Vec<Rect>,
    zoom: f32,
    shift: Shift,
}

pub struct Model {
    current_rect: Option<Rect>,
    steps: Vec<Step>,
}

impl Model {
    pub fn new(current_rect: Option<Rect>, steps: Vec<Step>) -> Self {
        Self {
            current_rect,
            steps,
        }
    }

    pub fn new_stub() -> Self {
        Model {
            steps: vec![Step {
                shift: Shift { dx: 0.0, dy: 0.0 },
                zoom: 1.0,
                rects: vec![Rect {
                    x: 10.0,
                    y: 10.0,
                    w: 20.0,
                    h: 20.0,
                }],
            }],
            current_rect: None,
        }
    }
}

fn convert_to_output(r: &Rect) -> Rectangle {
    let Rect { x, y, w, h } = *r;
    Rectangle {
        x,
        y,
        w,
        h,
        border_width: 1.0,
    }
}

pub fn update_model(model: &Model, _ev: MsgToEngine) -> MsgFromEngine {
    MsgFromEngine::Draw(model.steps[0].rects.iter().map(convert_to_output).collect())
}
