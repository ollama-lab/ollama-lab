pub trait ToLengthIndex {
    fn into_length_index(self, len: usize) -> Self;
}

impl ToLengthIndex for i64 {
    fn into_length_index(self, len: usize) -> Self {
        let mut target = self;

        while target < 0 {
            target += len as i64;
        }

        target.min((len - 1) as i64)
    }
}
