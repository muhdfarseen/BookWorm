import { connect } from 'mongoose'

export const connectDB=async()=>{
    try {
        await connect(process.env.MONGO_URL)
        console.log("database connected successfully")
    } catch (error) {
        console.log('error connecting database')
        process.exit(1);
    }
}

