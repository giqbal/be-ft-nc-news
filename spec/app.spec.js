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
    describe('/api', () => {
        it('GET returns status 200', () => {
            return request
                .get('/api')
                .expect(200)
        });
        it('GET returns status 404', () => {
            return request
                .get('/apis')
                .expect(404)
        });
    });
    describe('/api/topics', () => {
        it('GET topics returns status 200 and all topics', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('topics');
                    expect(res.body.topics.length).to.equal(2);
                    expect(res.body.topics[0]).to.have.all.keys(
                        '_id',
                        'title',
                        'slug',
                        '__v'
                    );
                });
        });
    });
    describe('/api/topics/:topic_slug/articles', () => {
        it('GET articles for a certain topic', () => {
            return request
                .get(`/api/topics/${topicDocs[0].slug}/articles`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('articles')
                    expect(res.body.articles.length).to.equal(2);
                    expect(res.body.articles[0]).to.have.all.keys(
                        '_id',
                        'title',
                        'body',
                        'created_by',
                        'belongs_to',
                        'votes',
                        'comments',
                        '__v'
                    );
                    expect(res.body.articles[0].belongs_to).to.equal(topicDocs[0].slug);
                    expect(res.body.articles[0].created_by).to.be.a('string');
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
    })
});

