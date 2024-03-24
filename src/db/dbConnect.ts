import mongoose from "mongoose";
import { getSingleChat, createChat} from './chats';

export default () => {
  const MONGO_URL = 'mongodb://127.0.0.1:27017/mydb';

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL);
  mongoose.connection.on('error', (error: Error) => console.log(error));
  mongoose.connection.on('connected', async () => {
    try {
      const existingChat = await getSingleChat();
      if (!existingChat)
        await createChat({messages: []});
    } catch (error) {
      console.error('Error checking chat existence:', error);
    }
  });
}