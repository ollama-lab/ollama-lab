// @generated automatically by Diesel CLI.

diesel::table! {
    bubbles (id) {
        id -> Integer,
        session -> Integer,
        role -> Text,
        content -> Text,
        date_created -> Timestamp,
        is_edited -> Bool,
    }
}

diesel::table! {
    roles (name) {
        name -> Text,
    }
}

diesel::table! {
    sessions (id) {
        id -> Integer,
        title -> Nullable<Text>,
        owner -> Text,
        date_created -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Text,
        password -> Nullable<Text>,
        is_default -> Bool,
        date_created -> Timestamp,
    }
}

diesel::joinable!(bubbles -> sessions (session));
diesel::joinable!(sessions -> users (owner));

diesel::allow_tables_to_appear_in_same_query!(
    bubbles,
    roles,
    sessions,
    users,
);
