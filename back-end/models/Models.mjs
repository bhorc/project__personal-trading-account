import mongoose from 'mongoose';

const { Schema, model } = mongoose;
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  type: { type: String, default: 'User' },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permission: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false },
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
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  invitesId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  membersId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
  balance: { type: Number, default: 0 },
  buy_price: { type: Number, default: 0 },
  sale_price: { type: Number, default: 0 },
  sold_price: { type: Number, default: 0 },
  fee_funds: { type: Number, default: 0 },
  fee_percent: { type: Number, default: 0 },
  created: { type: Number },
  updated: { type: Number },
});

const NotificationSchema = new Schema({
  type: { type: String, default: 'Notification' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  locationId: { type: Schema.Types.ObjectId, refPath: 'location' },
  location: { type: String },
  message: { type: String },
  seen: { type: Boolean, default: false },
  created: { type: Number },
  updated: { type: Number },
});

const SubscriptionSchema = new Schema({
  type: { type: String, default: 'Subscription' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  subscriptions: [{ type: String }],
});

const ItemSchema = new Schema({
  type: { type: String, default: 'Item' },
  assetid: { type: String, required: true },
  fullName: { type: String, required: true },
  exterior: { type: String },
  rarity: { type: String },
  item_type: { type: String },
  weapon_type: { type: String },
  gun_type: { type: String },
  float: { type: Number },
  pattern: { type: Number },
  stickers: { type: Array },
  icon: { type: String },
  inspect_link: { type: String },
  collection: { type: String },
  created: { type: Number },
  updated: { type: Number },
});

const TransactionSchema = new Schema({
  type: { type: String, default: 'Transaction' },
  assetid: { type: String, required: true },
  event: { type: String, required: true },
  status: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

export const User = model('User', UserSchema);
export const Group = model('Group', GroupSchema);
export const Site = model('Site', SiteSchema);
export const History = model('History', HistorySchema);
export const Notification = model('Notification', NotificationSchema);
export const Subscription = model('Subscription', SubscriptionSchema);
export const Item = model('Item', ItemSchema);
export const Transaction = model('Transaction', TransactionSchema);

export default {
  User, Group, Site, History, Notification, Subscription, Item, Transaction,
};
