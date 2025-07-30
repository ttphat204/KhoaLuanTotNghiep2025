const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Nếu đã có connection và đang hoạt động, trả về ngay
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }
  
  // Nếu đang trong quá trình kết nối, đợi
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }
  
  // Tạo connection mới
  const opts = {
    bufferCommands: false,
    maxPoolSize: 10, // Tăng pool size
    serverSelectionTimeoutMS: 5000, // Timeout nhanh hơn
    socketTimeoutMS: 45000, // Socket timeout
    family: 4 // Force IPv4
  };

  cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
    console.log('✅ MongoDB connected successfully');
    return mongoose;
  });

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

// Thêm function để kiểm tra connection status
function isConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { dbConnect, isConnected }; 