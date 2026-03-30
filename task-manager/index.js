const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// use the library's clean helper so we can sanitize objects in-place
const { clean: xssClean } = require('xss-clean/lib/xss');

app.use(helmet());
// express-mongo-sanitize's middleware assigns to `req.query` etc which can
// throw when those properties are getter-only in some environments. Use the
// library's `sanitize` helper and mutate the existing objects in-place to
// avoid replacing the request properties.
app.use((req, res, next) => {
  ['body', 'params', 'headers', 'query'].forEach((key) => {
    if (req[key]) {
      try {
        const original = req[key];
        const sanitized = mongoSanitize.sanitize(original);
        // Delete keys that were removed by sanitize
        Object.keys(original).forEach((k) => {
          if (!Object.prototype.hasOwnProperty.call(sanitized, k)) {
            try { delete original[k]; } catch (e) { /* ignore */ }
          }
        });
        // Copy sanitized values back onto the original object
        Object.keys(sanitized).forEach((k) => {
          original[k] = sanitized[k];
        });
      } catch (e) {
        // If anything goes wrong, don't break the request pipeline
      }
    }
  });
  next();
});
// apply xss cleaning in-place to avoid replacing getter-only request props
app.use((req, res, next) => {
  ['body', 'params', 'query'].forEach((key) => {
    if (req[key]) {
      try {
        const original = req[key];
        const sanitized = xssClean(original);
        if (typeof original === 'object' && original !== null) {
          // remove keys that are not present after sanitize
          Object.keys(original).forEach((k) => {
            if (!Object.prototype.hasOwnProperty.call(sanitized, k)) {
              try { delete original[k]; } catch (e) { /* ignore */ }
            }
          });
          // copy sanitized values back
          Object.keys(sanitized).forEach((k) => {
            original[k] = sanitized[k];
          });
        } else {
          // fallback: try to assign (may be getter-only; ignore failures)
          try { req[key] = sanitized; } catch (e) { /* ignore */ }
        }
      } catch (e) {
        // don't break the pipeline on sanitizer errors
      }
    }
  });
  next();
});

const corsOptions = {
    origin: 'https://task-manager-fronend.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes,
    max: 20, 
    message: 'Too many requests from this IP, please try again after 5 minutes'
})
app.use(limiter);
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api', uploadRoutes);

// Start the server

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');})
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

app.listen(3000, () => {
  console.log('Task Manager API is running on port 3000');
});