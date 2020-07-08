const mongoose = require("mongoose");

const metadataSchema = new mongoose.Schema(
	{
        _id: {type: Number},
        title: String,
        publication_date: Date,
        publisher: String,
        language: String,
        subjects: [{type: String}],
        authors: [{type: String}],
        license_rights: String
	},
	{ timestamps: true}
);

metadataSchema.index({"title":1})
metadataSchema.index({"authors":1})
metadataSchema.index({"publication_date":1})

const Metadata = mongoose.model("Metadata", metadataSchema);

module.exports = Metadata;
