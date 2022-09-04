import mongoose from 'mongoose';
const { Schema, model } = mongoose;

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
    type: { type: String, default: 'User' },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permission: { type: String, default: 'user' },
    isBanned: { type: Boolean, default: false },
    subscriptions: { type: Array, default: [] },
    username: { type: String },
    steamId: { type: String },
    avatar: { type: String },
    created: { type: Number },
    updated: { type: Number },
});

const GroupSchema = new Schema({
    type: { type: String, default: 'Group' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: { type: String, required: true },
    created: { type: Number },
    updated: { type: Number },
});

const SiteSchema = new Schema({
    type: { type: String, default: 'Site' },
    name: { type: String, required: true },
    url: { type: String, required: true },
    logo: { type: String, required: true },
    created: { type: Number },
    updated: { type: Number },
});

const HistorySchema = new Schema({
    type: { type: String, default: 'History' },
    siteId: { type: Schema.Types.ObjectId, required: true, ref: 'Site' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    transactions: { type: Array, required: true, default: [] },
    purchases: { type: Array, required: true, default: [] },
    balance: { type: Number, required: true, default: 0 },
    created: { type: Number },
    updated: { type: Number },
});

const NotificationSchema = new Schema({
    type: { type: String, default: 'Notification' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    locationId: { type: Schema.Types.ObjectId, required: true, refPath: 'location'},
    location: { type: String, enum: ['User', 'Group', 'Site', 'History'] },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    created: { type: Number },
    updated: { type: Number },
});

export const User = model('User', UserSchema);
export const Group = model('Group', GroupSchema);
export const Site = model('Site', SiteSchema);
export const History = model('History', HistorySchema);
export const Notification = model('Notification', NotificationSchema);

export default { User, Group, Site, History, Notification };