"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const mongoose = require("mongoose");
// Connect to mongoose
mongoose.connect(process.env.MONGO, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
// Export models
__export(require("./User"));
//# sourceMappingURL=index.js.map