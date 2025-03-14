import {PrismaClient} from '@prisma/client' 
const client = new PrismaClient()

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

async function createTodo(){
    await client.todo.create({
        data:{
            title:"Gym",
            description:"Go to gym",
            done:true,
            userId:1
        }
    })
}
// createTodo()

async function fetchUserAndTodo(){
    const userAndTodo  = await client.user.findFirst({
        where:{
            id:1
        },
        select:{
            username:true,
            password:true,
            email:true,
            todos:true
        }
        
    })
    console.log(userAndTodo)
}
fetchUserAndTodo()