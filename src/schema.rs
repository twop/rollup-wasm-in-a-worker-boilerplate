
use serde::{Deserialize, Serialize};


#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum MsgToEngine {
    DragStart(Point),
    DragEnd(Point),
    DragMove(f32, f32),
    IncreaseZoom,
    DecreaseZoom,
    NewStep,
    KeyPress(Arrow),
    RunAnimation,
    AnimationFrame(f32),
}


#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum MsgFromEngine {
    Draw(Vec<Rectangle>),
    Nothing,
    Done,
}


#[derive(Deserialize, Serialize, Debug, Clone)]
pub enum Arrow {
    Left,
    Right,
    Up,
    Down,
}


#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Point {
    pub x: f32,
    pub y: f32,
}


#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Rectangle {
    pub x: f32,
    pub y: f32,
    pub w: f32,
    pub h: f32,
    #[serde(rename = "borderWidth")]
    pub border_width: f32,

}

