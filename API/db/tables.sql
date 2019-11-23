CREATE DATABASE mobilehybriddb;

create extension if not exists "uuid-ossp";

create table Users (
    id uuid not null default uuid_generate_v4(),
    username varchar(20) not null,
    password varchar(100) not null
);