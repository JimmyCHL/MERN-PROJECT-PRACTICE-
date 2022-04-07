import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: mongoose.Schema.Types.ObjectId,
});

export default mongoose.model('User', userSchema);