process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {expect} = require('chai');

describe('NC news', () => {
    describe('/api', () => {
        it('GET returns status 200', () => {
            return request
                .get('/api')
                .expect(200)
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
});

