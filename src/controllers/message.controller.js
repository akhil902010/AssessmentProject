 import { Message } from '../models/message.models.js';

 const scheduleMessage = async (req, res) => {

    // let messageSchedule = {
    //    "message" : "Hello",
    //     "day" : "2024-05-23",
    //     "time" : "18:31"
    // }
    
    const { message, day, time } = req.body;
    // const { message, day, time } = messageSchedule;
  
    if (!message || !day || !time) {
      return res.status(400).json({ message: 'Please provide message, day, and time' });
    }
  
    const scheduledDate = new Date(`${day}T${time}:00`);
  
    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time format' });
    }
  
    const newMessage = new Message({ message, scheduledDate, inserted:false });
    await newMessage.save();
  
    res.status(201).json({ message: 'Message scheduled successfully' });
}

export default { scheduleMessage };