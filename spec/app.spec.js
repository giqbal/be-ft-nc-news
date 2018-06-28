process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {expect} = require('chai');
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
        it('GET request returns 404 with incorrect url', () => {
            return request
                .get('/api/topic')
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Page not found');
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
        it('GET returns 404 for non-existent topic', () => {
            return request
                .get('/api/topics/abc/articles')
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.equal(`Page not found for topic: abc`)
                })
        })
        it('POST article returns status 201 and created article', () => {
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
        it('POST returns status 400 if required field is missing', () => {
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({})
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request! articles validation failed: created_by: Path `created_by` is required., title: Path `title` is required.');
                });
        });
        it('POST returns status 400 if incorrect format of created_by is used', () => {
            const title = 'Superman defeated by one and only!';
            const body = 'Super villan Mitch battled superman to the death and won last night.';
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({
                    title,
                    body,
                    created_by: 'abc'
                })
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request! articles validation failed: created_by: Cast to ObjectID failed for value "abc" at path "created_by"');
                });
        });
        it('POST returns status 404 for non-existent topic slug', () => {
            const title = 'Superman defeated by one and only!';
            const body = 'Super villan Mitch battled superman to the death and won last night.';
            return request
                .post(`/api/topics/superhero/articles`)
                .send({
                    title,
                    body,
                    created_by: userDocs[0]._id
                })
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Page not found for slug: superhero');
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
        it('GET returns status 404 with incorrect url', () => {
            return request
                .get('/api/article')
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Page not found');
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
                    expect(body.article.title).to.equal(articleDocs[0].title);
                    expect(body.article.body).to.equal(articleDocs[0].body);
                    expect(body.article.created_by).to.be.a('string');
                    expect(body.article.belongs_to).to.equal(articleDocs[0].belongs_to);
                    expect(body.article.votes).to.equal(articleDocs[0].votes);
                });
        });
        it('GET returns status 404 for non-existent article ID', () => {
            return request
                .get(`/api/articles/${userDocs[0]._id}`)
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.equal(`Page not found for id: ${userDocs[0]._id}`);
                });
        });
        it('GET returns status 400 for invalid ID format', () => {
            return request
                .get('/api/articles/abc')
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request! abc is not a valid ID')
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
        it('PUT returns status 400 for invalid vote query', () => {
            return request
                .put(`/api/articles/${articleDocs[0]._id}?vote=zero`)
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request: Query must be vote=up or vote=down')
                })
        });
        it('PUT returns status 400 query other then vote', () => {
            return request
                .put(`/api/articles/${articleDocs[0]._id}?voting=up`)
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request: Query must be vote=up or vote=down')
                })
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
        it('GET returns status 400 for invalid ID format', () => {
            return request
                .get('/api/articles/abc/comments')
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request! abc is not a valid ID')
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
        it('POST returns status 400 if required field is missing', () => {
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({})
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request! comments validation failed: created_by: Path `created_by` is required., body: Path `body` is required.');
                });
        });
        it('POST returns status 400 with invalid article ID format', () => {
            return request
                .post(`/api/articles/abc/comments`)
                .send({
                    body: 'Poop article',
                    created_by: userDocs[0]._id
                })
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request! abc is not a valid ID');
                });
        });
        it('POST returns status 404 with non-existent article ID', () => {
            return request
                .post(`/api/articles/${userDocs[0]._id}/comments`)
                .send({
                    body: 'Poop article',
                    created_by: userDocs[0]._id
                })
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.equal(`Page not found for id: ${userDocs[0]._id}`);
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
        it('PUT request with incorrect vote query returns status 400', () => {
            return request
                .put(`/api/comments/${commentDocs[0]._id}?vote=high`)
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request: Query must be vote=up or vote=down');
                });
        });
       it('PUT request with query other then vote returns status 400', () => {
            return request
                .put(`/api/comments/${commentDocs[0]._id}?votes=up`)
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal('Bad request: Query must be vote=up or vote=down');
                });
        });
        it('PUT request returns status 400 for ID with incorrect format', () => {
            return request
                .put(`/api/comments/abc?vote=up`)
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.equal(`Bad request! abc is not a valid ID`);
                });
        });
        it('PUT request returns status 404 for non-existent ID', () => {
            return request
                .put(`/api/comments/${userDocs[0]._id}?vote=up`)
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.equal(`Page not found for id: ${userDocs[0]._id}`);
                });
        });
        it('DELETE returns status 204', () => {
            return request
                .delete(`/api/comments/${commentDocs[0]._id}`)
                .expect(204)
                .then(({body}) => {
                    expect(body).to.be.empty;
                    return request.delete(`/api/comments/${commentDocs[0]._id}`).expect(404);
                })
                .then(({body: {message}}) => {
                    expect(message).to.equal(`Page not found for id: ${commentDocs[0]._id}`)
                })
        });
        it('DELETE returns status 404 when non-existent comment ID is used', () => {
            return request
                .delete(`/api/comments/${articleDocs[0]._id}`)
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.be.equal(`Page not found for id: ${articleDocs[0]._id}`);
                });
        });
        it('DELETE returns status 400 when comment ID is in an incorect format', () => {
            return request
                .delete(`/api/comments/abc`)
                .expect(400)
                .then(({body: {message}}) => {
                    expect(message).to.be.equal(`Bad request! abc is not a valid ID`);
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
                    expect(body.user._id).to.equal(userDocs[1]._id.toString());
                    expect(body.user.name).to.equal(userDocs[1].name);
                    expect(body.user.username).to.equal(userDocs[1].username);
                    expect(body.user.avatar_url).to.equal(userDocs[1].avatar_url);
                });
        });
        it('GET returns status 404 with non existent username', () => {
            const nonexistentUsername = 'giqbal'
            return request
                .get(`/api/users/${nonexistentUsername}`)
                .expect(404)
                .then(({body: {message}}) => {
                    expect(message).to.equal(`Page not found for id: ${nonexistentUsername}`);
                });
        });
    });
});

