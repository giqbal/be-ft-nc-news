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
        this.timeout(4000);
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
        it('GET returns status 200 and an article', () => {
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
        it('PUT returns status 200 and an incremented vote count for article', () => {
            return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=up`)
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
                        '__v'
                    );
                    expect(body.article._id).to.equal(articleDocs[0]._id.toString());
                    expect(body.article.votes).to.equal(1);
                    expect(body.article.created_by).to.be.a('string');
                });
        });
        it('PUT returns status 200 and an decremented vote count for article', () => {
            return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=down`)
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
                        '__v'
                    );
                    expect(body.article._id).to.equal(articleDocs[0]._id.toString());
                    expect(body.article.votes).to.equal(-1);
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
    describe('api/comments/:comment_id', () => {
        it('PUT returns status 200 and an incremented vote count for a comment', () => {
            return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=up`)
                .expect(200)
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
                    expect(body.comment._id).to.equal(commentDocs[0]._id.toString());
                    expect(body.comment.votes).to.equal(commentDocs[0].votes + 1);
                    expect(body.comment.created_by).to.be.a('string');
                });
        });
        it('PUT returns status 200 and an decremented vote count for a comment', () => {
            return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=down`)
                .expect(200)
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
                    expect(body.comment._id).to.equal(commentDocs[0]._id.toString());
                    expect(body.comment.votes).to.equal(commentDocs[0].votes - 1);
                    expect(body.comment.created_by).to.be.a('string');
                });
        });
        it('DELETE returns status 204', () => {
            return request
                .delete(`/api/comments/${commentDocs[0]._id}`)
                .expect(204)
                .then(({body}) => {
                    expect(body).to.be.empty;
                });
        });
    });
    describe('api/users/:username', () => {
        it('GET returns status 200 and user by username', () => {
            return request
                .get(`/api/users/${userDocs[1].username}`)
                .expect(200)
                .then(({body}) => {
                    expect(body).to.have.all.keys('user');
                    expect(body.user).to.have.all.keys(
                        '_id',
                        'name',
                        'username',
                        'avatar_url',
                        '__v'
                    );
                    expect(body.user.username).to.equal(userDocs[1].username);
                });
        });
        it('GET returns status 404 with non existent username', () => {
            const nonexistentUsername = 'giqbal'
            return request
                .get(`/api/users/${nonexistentUsername}`)
                .expect(404)
                .then(({body}) => {
                    expect(body.message).to.equal(`Page not found for id: ${nonexistentUsername}`);
                });
        });
    });
});

