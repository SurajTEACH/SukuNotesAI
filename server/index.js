import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/connectDb.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import notesRouter from './routes/generateNotes.route.js';
import pdfNotesRouter from './routes/pdfNotes.route.js';
import interviewRouter from './routes/interview.route.js';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"]
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.json({
        message:"SUKUNotesAI Server is running"
    })
})

app.use("/api/auth", authRouter);
app.use("/api/user",userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/notes-download", pdfNotesRouter);
app.use("/api/interview", interviewRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});