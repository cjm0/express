var Schema = require('mongoose').Schema;


var mathNum1 = Math.floor(Math.random()*100)+100;
var mathNum2 = Math.floor(Math.random()*100)+100;

var ArticleSchema = Schema({
    type: { type: String, required: true },
    subType: { type: String, required: true },
    hot: { type: Number, required: true },
    id: { type: String, required: true },

    domain: String,

    videoUrl: String,
    videoImg: String,
    videoAdvImg: String,
    videoTime: String,
    videoCount: { type: Number, default: mathNum1 },

    author: String,
    authorImg: String,
    authorAlias: String,
    authorAddress: String,
    authorLinkImg: String,

    advImg: String,
    advUrl: String,
    advUser: String,
    advAlias: String,

    aboutID: Array,
    aboutID1: String,
    aboutID2: String,
    aboutID3: String,
    aboutID4: String,
    aboutID5: String,
    aboutBriefInfos: Array,

    seoType: Number,
    val1: Boolean,
    val2: Boolean,

    seoQA: Array,
    answer: String,
    seoSteps: {
        key: String,
        desc: String,
        step1: String,
        step2: String,
        step3: String,
        step4: String,
        step5: String,
    },

    tags: [String],
    title: { type: String, required: true },
    articleImgs: Array,
    readCount: { type: Number, default: mathNum2 },
    content: { type: String, required: true },
}, {
    timestamps: true
});

/* global db */
module.exports = db.model('Article', ArticleSchema);

