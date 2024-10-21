// test/e2e/app.test.js
const request = require('supertest');
const app = require('../../index'); 
const { expect } = require('chai');
const sinon = require('sinon');
const Movie = require('../../models/movieModel'); 

const baseUrl = "http://localhost:8000/api/v1.0/moviebooking"

describe('E2E Tests for Movies API', () => {
    afterEach(() => {
        sinon.restore(); 
    });

    describe('get movies by user', () => {



        it('GET /api/movies should return all movies', async () => {
            const mockMovies = [
                { movieName: 'Movie 1', movieBanner: 'banner1.jpg' },
                { movieName: 'Movie 2', movieBanner: 'banner2.jpg' }
            ];

            sinon.stub(Movie, 'find').returns({
                select: sinon.stub().returns(Promise.resolve(mockMovies))
            });
            const response = await request(app).get(`/api/v1.0/moviebooking/all`);

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Movies found');
            expect(response.body.data.movies).to.deep.equal(mockMovies);
        });

        it('GET /api/movies should return a message when no movies are found', async () => {
            sinon.stub(Movie, 'find').returns({
                select: sinon.stub().returns(Promise.resolve([]))
            });

            const response = await request(app).get(`/api/v1.0/moviebooking/all`);

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('No Existing Released Movie found');
            expect(response.body.data.movies).to.be.an('array').that.is.empty;
        });

        it('GET /api/movies should return a 500 error on service failure', async () => {
            sinon.stub(Movie, 'find').returns({
                select: sinon.stub().returns(Promise.reject(new Error('Database Error')))
            });

            const response = await request(app).get(`/api/v1.0/moviebooking/all`);

            expect(response.status).to.equal(500);
            expect(response.body.err).to.equal('Internal Server Error');
        });
    })


    describe('search movie by user', () => {
        it('GET /movies/search/:movieName should return movies that match the name', async () => {
            const mockMovies = [
                { movieName: 'Interstellar', movieBanner: 'interstellar.jpg' },
                { movieName: 'Doctor Strange', movieBanner: 'doctorStrange.jpg' }
            ];

            sinon.stub(Movie, 'find').returns(Promise.resolve(mockMovies));

            const response = await request(app).get(`/api/v1.0/moviebooking/movies/search/Interstellar`);

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Movies found');
            expect(response.body.data.movies).to.deep.equal(mockMovies);
        });

        it('GET /movies/search/:movieName should return a message when no movies are found', async () => {
            sinon.stub(Movie, 'find').returns(Promise.resolve([]));

            const response = await request(app).get(`/api/v1.0/moviebooking/movies/search/nonexistant`);

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('No Existing Released Movie found');
            expect(response.body.data.movies).to.deep.equal([]);
        });

        it('GET /movies/search/:movieName should return a 500 error on service failure', async () => {

            sinon.stub(Movie, 'find').returns(Promise.reject(new Error('Database error')));

            const response = await request(app).get(`/api/v1.0/moviebooking/movies/search/Interstellar`);

            expect(response.status).to.equal(500);
            expect(response.body.err).to.equal('Internal Server Error');
        });
    })
});
