import { ConnectOptions, connect } from "mongoose";
import { UserModel } from "./models/user.model";
connect('mongodb://localhost/instagram');


async function test() {
    const user = new UserModel({});
    let s = user.save();
    console.log(s);
}

test().catch(err => console.log(err));