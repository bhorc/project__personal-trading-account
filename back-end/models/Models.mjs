import mongoose from 'mongoose';

const { Schema, model } = mongoose;
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  type: { type: String, default: 'User' },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permission: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  username: { type: String },
  steamId: { type: String },
  avatar: { type: String },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { strict: true, timestamps: true, versionKey: false });

const GroupSchema = new Schema({
  type: { type: String, default: 'Group' },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  invitesId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  membersId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  name: { type: String, required: true },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { strict: true, timestamps: true, versionKey: false });

const SiteSchema = new Schema({
  type: { type: String, default: 'Site' },
  domain: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  logo: { type: String, required: true },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { strict: true, timestamps: true, versionKey: false });

const ItemSchema = new Schema({
  type: { type: String, default: 'Item' },
  assetId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  exterior: { type: String, default: null },
  shortExterior: { type: String, default: null },
  rarity: { type: String, default: null },
  itemType: { type: String, default: null },
  weaponType: { type: String, default: null },
  gunType: { type: String, default: null },
  float: { type: Number, default: null },
  pattern: { type: Number, default: null },
  overprice: { type: Number, default: 0 },
  overpay: { type: Object, default: {} },
  stickers: { type: Array, default: [] },
  iconUrl: { type: String, default: null },
  inspectLink: { type: String, default: null },
  tournament: { type: String, default: null },
  collectionName: { type: String, default: null },
  stattrak: { type: Boolean, default: false },
  souvenir: { type: Boolean, default: false },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { strict: true, timestamps: true, versionKey: false });

const HistorySchema = new Schema({
  type: { type: String, default: 'History' },
  steamId: { type: String, required: true, ref: 'User' },
  assetId: { type: String, required: true, unique: true },
  transactions: [{
    location: { type: String },
    status: { type: String },
    method: { type: String },
    depositPrice: { type: Number },
    buyPrice: { type: Number },
    salePrice: { type: Number },
    soldPrice: { type: Number },
    feeFunds: { type: Number },
    feePercent: { type: Number },
    buyTime: { type: Number },
    saleTime: { type: Number },
    soldTime: { type: Number },
    createdAt: { type: Number },
  }],
  statusUpdatedAt: { type: Number },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { strict: true, timestamps: true, versionKey: false });

const NotificationSchema = new Schema({
  type: { type: String, default: 'Notification' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  locationId: { type: Schema.Types.ObjectId, refPath: 'location' },
  location: { type: String },
  message: { type: String },
  seen: { type: Boolean, default: false },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { strict: true, timestamps: true, versionKey: false });

const SubscriptionSchema = new Schema({
  type: { type: String, default: 'Subscription' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  subscriptions: [{ type: String }],
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { strict: true, timestamps: true, versionKey: false });

export const User = model('User', UserSchema);
export const Group = model('Group', GroupSchema);
export const Site = model('Site', SiteSchema);
export const Item = model('Item', ItemSchema);
export const History = model('History', HistorySchema);
export const Notification = model('Notification', NotificationSchema);
export const Subscription = model('Subscription', SubscriptionSchema);

export default {
  User, Group, Site, History, Item, Notification, Subscription,
};
