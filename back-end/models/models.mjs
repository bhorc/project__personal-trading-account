import mongoose from 'mongoose';
const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permission: { type: String, default: 'user' },
    username: { type: String },
    steamId: { type: String },
    avatar: { type: String },
    registered: { type: Number },
    isBanned: { type: Boolean, default: false },
});

const GroupSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    members: { type: Array, required: true, default: [] },
    created: { type: Number },
});

const SiteSchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    logo: { type: String, required: true },
});

const HistorySchema = new Schema({
    siteId: { type: Schema.Types.ObjectId, required: true, ref: 'Site' },
    balance: { type: Number, required: true, default: 0 },
    transactions: { type: Array, required: true, default: [] },
    purchases: { type: Array, required: true, default: [] },
    updated: { type: Number },
});

export const User = mongoose.model('User', UserSchema);
export const Group = mongoose.model('Group', GroupSchema);
export const Site = mongoose.model('Site', SiteSchema);
export const History = mongoose.model('History', HistorySchema);

export default { User, Group, Site, History };