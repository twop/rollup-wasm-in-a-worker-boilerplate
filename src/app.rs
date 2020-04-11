use crate::{
    model::{update_model, Model},
    schema::{MsgFromEngine, MsgToEngine},
};

pub struct App {
    model: Model,
}

impl App {
    pub fn new() -> Self {
        Self {
            model: Model::new_stub(),
        }
    }

    pub fn update(&mut self, ev: MsgToEngine) -> MsgFromEngine {
        let output_ev = update_model(&self.model, ev);
        output_ev
    }
}
