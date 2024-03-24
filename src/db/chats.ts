import mongoose from "mongoose";
import { Message } from "../types/interfaces";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new Schema({
  messages: [MessageSchema]
});

export const ChatModel = mongoose.model('Chat', ChatSchema);

export const getMessages = async() => {
  const chat = await ChatModel.findOne();
  return chat.messages;
};
export const getSingleMessage = async(messageId: string) => {
  const chat = await ChatModel.findOne();
  const message = chat.messages.id(messageId);
  return message;
};
export const getSingleChat = () => ChatModel.findOne();
export const createChat = (values: Record<string, any>) => new ChatModel(values).save()
  .then(chat => {
    console.log('Chat created successfully.');
    chat.toObject()
  });
export const addMessage = async (message: Message) => {
  const chat = await ChatModel.findOne();
  chat.messages.push(message);
  await chat.save();
  return chat.messages;
};

export const updateMessage = async (messageId: string, content: string) => {
  const chat = await ChatModel.findOne();
  const message = chat.messages.id(messageId);
  message.content = content;
  await chat.save();
  return message.toObject();
};

export const deleteMessage = async (messageId: string) => {
  const chat = await ChatModel.findOne();
  const messageIndex = chat.messages.findIndex(message => message._id.equals(messageId));
  chat.messages.splice(messageIndex, 1);
  await chat.save();
};
