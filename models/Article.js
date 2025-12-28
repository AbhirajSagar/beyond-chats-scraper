import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema
({
    url: {type: String, required: true},
    content: {type: String, required: true}
});

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);