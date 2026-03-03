const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },

    // Localisation (pour la carte)
    location: {
      address: { type: String, trim: true, maxlength: 120 },
      lat: { type: Number, required: true, min: -90, max: 90 },
      lng: { type: Number, required: true, min: -180, max: 180 },
    },

    category: {
      type: String,
      enum: ["road", "lighting", "waste", "water", "other"],
      default: "other",
    },

    status: { type: String, enum: ["open", "resolved"], default: "open" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    votesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
