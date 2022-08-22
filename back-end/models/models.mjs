import mongoose from 'mongoose';
const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
    permissions: { type: Array, default: ['user'] },
    username: { type: String },
    steamId: { type: String },
    avatar: { type: String },
    registered: { type: Number },
    isLoggedIn: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
});

const GroupSchema = new Schema({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    members: { type: Array, required: true, default: [] },
    created: { type: Number },
});

const SiteSchema = new Schema({
    historyId: { type: Schema.Types.ObjectId, ref: 'History', required: true, default: null },
    name: { type: String, required: true },
    url: { type: String, required: true },
    logo: { type: String, required: true },
});

const HistorySchema = new Schema({
    balance: { type: Number, required: true, default: 0 },
    transactions: { type: Array, required: true, default: [] },
    solds: { type: Array, required: true, default: [] },
    updated: { type: Number, required: true, default: Date.now() },
});

export const User = mongoose.model('User', UserSchema);
export const Group = mongoose.model('Group', GroupSchema);
export const Site = mongoose.model('Site', SiteSchema);
export const History = mongoose.model('History', HistorySchema);

export default { User, Group, Site, History };