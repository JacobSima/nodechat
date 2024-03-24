import mongoose from "mongoose";

interface Message {
  sender: mongoose.Types.ObjectId;
  content: string;
}

export { Message }