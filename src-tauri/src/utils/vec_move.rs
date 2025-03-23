pub trait MoveElement {
    fn move_element(&mut self, src: usize, dest: usize);
}

impl<T> MoveElement for Vec<T> {
    fn move_element(&mut self, src: usize, dest: usize) {
        for i in 0..(dest - src) {
            self.swap(src, dest - i);
        }
    }
}
