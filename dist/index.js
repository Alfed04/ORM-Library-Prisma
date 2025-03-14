"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
// async function UserCrudOperations(){
//create a user
// await client.user.create({
//     data:{
//         username:"ALFED",
//         email:"alfedkhan2002@gmail.com",
//         password:"alfed@123",
//     }
// })
//delete a user
// await client.user.delete({
//     where:{
//         id:1
//     }
// })
//update a user
// await client.user.update({
//     where:{
//         id:1
//     },
//     data:{
//         username:"ALFED KHAN",
//         email:"alfedkhan2003@gmail.com",
//         password:"alfed@2003"
//     }
// })
//find or read a user
// const user = await client.user.findFirst({
//     where:{
//         id: 1
//     }
// })
// console.log(user)
// }
// UserCrudOperations()
function createTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.todo.create({
            data: {
                title: "Gym",
                description: "Go to gym",
                done: true,
                userId: 1
            }
        });
    });
}
// createTodo()
function fetchUserAndTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        const userAndTodo = yield client.user.findFirst({
            where: {
                id: 1
            },
            select: {
                username: true,
                password: true,
                email: true,
                todos: true
            }
        });
        console.log(userAndTodo);
    });
}
fetchUserAndTodo();
