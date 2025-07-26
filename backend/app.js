const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary').v2;


const app = express();
dotenv.config({ path: './config.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

app.use(cors({
    origin : process.env.FRONTEND_URL,
    methods : ['GET','HEAD','PUT','PATCH','POST','DELETE']
}));

app.use(express.json());
app.use(fileUpload({ useTempFiles: true , tempFileDir : '/tmp/'}));

const storySchema = new mongoose.Schema({
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: {
    type: Date,
    required: true,
  }
});

storySchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
const Story = mongoose.model('Story', storySchema);

app.post('/api/story', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'stories',
    });

    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    // const expireAt = new Date(Date.now() + 1 * 60 * 1000);

    const story = new Story({
      image: result.secure_url,
      expireAt
    });
    await story.save();

    // if (fs.existsSync(file.tempFilePath)) {
    //   fs.unlinkSync(file.tempFilePath);
    // }

    res.status(201).json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/story', async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));