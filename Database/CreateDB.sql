CREATE TABLE users (
    id int primary key not null,
    email nvarchar(250) not null,
    password nvarchar(MAX) not null,
    full_name nvarchar(250) not null,
    created_at datetime,
    updated_at datetime 
);

CREATE TABLE rooms (
    id int primary key not null,
    display_name nvarchar(250) not null,
    light_state bit not null,
    switch_state int not null check (switch_state between 0 and 2),
    room_brightness int check (room_brightness >= 0),
    light_brightness int check (light_brightness >= 0),
    number_of_people int not null check (number_of_people >= 0),
    updated_at datetime
)

CREATE TABLE room_users (
    user_id int,
    room_id int
);

ALTER Table room_users ADD CONSTRAINT fk_user FOREIGN KEY (user_id) references users(id);

ALTER Table room_users ADD CONSTRAINT fk_room FOREIGN KEY (room_id) references rooms(id)