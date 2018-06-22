process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {expect} = require('chai');
const {Topic} = require('../models/index');
const seedDB = require('../seed/seed');
const testData = require('../seed/testData/index');
const mongoose = require('mongoose');

let articleDocs, topicDocs, commentDocs, userDocs;

describe('NC news', () => {
    beforeEach(function() {
        this.timeout(5000);
        return seedDB(testData)
            .then(docs => {
                [userDocs, topicDocs, articleDocs, commentDocs] = docs;
            });
    });
    after(() => {
        return mongoose.disconnect();
    })
    describe('api', () => {
        it('GET returns status 200', () => {
            return request
                .get('/api')
                .expect(200)
        });
        it('GET with incorrect url returns status 404', () => {
            return request
                .get('/apis')
                .expect(404)
        });
    });
    describe('api/topics', () => {
        it('GET topics returns status 200 and all topics', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then(({body}) => {
                    expect(body).to.have.all.keys('topics');
                    expect(body.topics.length).to.equal(2);
                    expect(body.topics[0]).to.have.all.keys(
                        '_id',
                        'title',
                        'slug',
                        '__v'
                    );
                });
        });
    });
    describe('api/topics/:topic_slug/articles', () => {
        it('GET articles for a certain topic', () => {
            return request
                .get(`/api/topics/${topicDocs[0].slug}/articles`)
                .expect(200)
                .then(({body: {articles}}) => {                    
                    expect(articles.length).to.equal(2);
                    expect(articles[0]).to.have.all.keys(
                        '_id',
                        'title',
                        'body',
                        'created_by',
                        'belongs_to',
                        'votes',
                        'comments',
                        '__v'
                    );
                    expect(articles[0].belongs_to).to.equal(topicDocs[0].slug);
                    expect(articles[0].created_by).to.be.a('string');
                });
        });
        it('POST article returns status 201 and craeted article', () => {
            const title = 'Superman defeated by one and only!';
            const body = 'Super villan Mitch battled superman to the death and won last night.';
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({
                    title,
                    body,
                    created_by: userDocs[0]._id
                })
                .expect(201)
                .then(({body: {article}}) => {
                    expect(article).to.have.all.keys(
                        '_id',
                        'title',
                        'body',
                        'created_by',
                        'belongs_to',
                        'votes',
                        '__v'
                    );
                    expect(article.title).to.equal(title);
                    expect(article.body).to.equal(body);
                    expect(article.created_by).to.equal(userDocs[0]._id.toString());
                    expect(article.belongs_to).to.equal(topicDocs[0].slug);
                });
 
        });
    });
    describe('api/articles', () => {
        it('GET returns status 200 and array of articles', () => {
            return request
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    expect(body).to.have.all.keys('articles');
                    expect(body.articles.length).to.equal(4);
                    expect(body.articles[0]).to.have.all.keys(
                        '_id',
                        'title',
                        'body',
                        'created_by',
                        'belongs_to',
                        'votes',
                        'comments',
                        '__v'
                    );
                    expect(body.articles[0].created_by).to.be.a('string');
                });
                
        });
    });
    describe('api/articles/:article_id', () => {
        it('GET returns status 200 and array of articles', () => {
            return request
                .get(`/api/articles/${articleDocs[0]._id}`)
                .expect(200)
                .then(({body}) => {
                    expect(body).to.have.all.keys('article');                    
                    expect(body.article).to.have.all.keys(
                        '_id',
                        'title',
                        'body',
                        'created_by',
                        'belongs_to',
                        'votes',
                        'comments',
                        '__v'
                    );
                    expect(body.article._id).to.equal(articleDocs[0]._id.toString());
                    expect(body.article.created_by).to.be.a('string');
                });
        });
    });
    describe('api/articles/:article_id/comments', () => {
        it('GET returns status 200 and array of comments', () => {
            return request
                .get(`/api/articles/${articleDocs[0]._id}/comments`)
                .expect(200)
                .then(({body}) => {
                    expect(body).to.have.all.keys('comments');   
                    expect(body.comments.length).to.equal(2);                 
                    expect(body.comments[0]).to.have.all.keys(
                        '_id',                        
                        'body',
                        'created_by',
                        'belongs_to',
                        'votes',
                        'created_at',
                        '__v'
                    );
                    expect(body.comments[0].belongs_to).to.equal(articleDocs[0]._id.toString());
                    expect(body.comments[0].created_by).to.be.a('string');
                });
        });
        it('POST returns status 201 and added comment', () => {
            const commentBody = 'I totally agree, take my money.'
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    body: commentBody,
                    created_by: userDocs[1]._id
                })
                .expect(201)
                .then(({body}) => {
                    expect(body).to.have.all.keys('comment');                
                    expect(body.comment).to.have.all.keys(
                        '_id',                        
                        'body',
                        'created_by',
                        'belongs_to',
                        'votes',
                        'created_at',
                        '__v'
                    );
                    expect(body.comment.belongs_to).to.equal(articleDocs[0]._id.toString());
                    expect(body.comment.body).to.equal(commentBody);
                    expect(body.comment.created_by).to.be.a('string');
                });
        });
    });
});

