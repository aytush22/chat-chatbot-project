import Redis from "ioredis";

const redisClient = new Redis({
    host: process.env.REDDIS_HOST,
    port: process.env.REDDIS_PORT,
    password: process.env.REDDIS_PASSWORD
});

redisClient.on('connect', () => {
    console.log("Redis Connected");
});

export default redisClient;
