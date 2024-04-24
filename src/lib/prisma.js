import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// console.log("runned");
prisma.$connect().then(()=>{
    console.log("\x1b[33mPrisma client connected to the database!\x1b[0m");
})
.catch((error)=>{
    console.error("\x1b[31mError connecting to the database:", error, "\x1b[0m");
})



export default prisma;
