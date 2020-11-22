import * as mongoose from 'mongoose'

export interface SignObject {
    username: string
    password: string
}

export interface User extends mongoose.Document{
    username: string
    password: string
    name: string
    surname: string
}

export interface ResultLog {
    completed: boolean
    output: string
}
