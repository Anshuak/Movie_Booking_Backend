const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index');
const Movie = require('../../models/movieModel');
const Ticket = require('../../models/ticketModel');
const { generateToken } = require('../../utils/auth');


describe('admin movie apis', () => {
    let authToken;

    before(async () => {
        console.error = () => {};

        authToken = generateToken({ id: 'userId', role: 'admin' });
    });

    describe('deleteMovieService', () => {


        afterEach(() => {
            sinon.restore();
        });


        it('should return 400 if no movie is found', async () => {
            sinon.stub(Movie, 'findOne').returns(Promise.resolve(null));

            const response = await request(app)
                .delete('/api/v1.0/moviebooking/nonexistentMovie/delete/userId')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ theatreName: 'Theatre 1' });

            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('No Movie Found');
        });

        it('should return 400 if tickets are booked for the movie', async () => {
            sinon.stub(Movie, 'findOne').returns(Promise.resolve({ _id: 'someId' }));
            sinon.stub(Ticket, 'find').returns(Promise.resolve([{ ticketId: 'ticket1' }]));
            const response = await request(app)
                .delete('/api/v1.0/moviebooking/nonexistentMovie/delete/userId')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ theatreName: 'Theatre 1' });

            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Cannot delete movie');
        });

        it('should delete the movie successfully if no tickets are booked', async () => {
            sinon.stub(Movie, 'findOne').returns(Promise.resolve({ _id: 'someId' }));
            sinon.stub(Ticket, 'find').returns(Promise.resolve([]));
            sinon.stub(Movie, 'findByIdAndDelete').returns(Promise.resolve());

            const response = await request(app)
                .delete('/api/v1.0/moviebooking/existingMovie/delete/userId')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ theatreName: 'Theatre 1' });

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Movie deleted successfully');
        });

        it('should return 500 if an error occurs', async () => {
            sinon.stub(Movie, 'findOne').returns(Promise.reject(new Error('Database error')));

            const response = await request(app)
                .delete('/api/v1.0/moviebooking/existingMovie/delete/userId')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ theatreName: 'Theatre 1' });

            expect(response.status).to.equal(500);
            expect(response.body.err).to.equal('Internal Server Error');
        });
    });

    describe('addMovieService', () => {
        afterEach(() => {
            sinon.restore(); 
        });

        it('should add a movie successfully', async () => {
            const mockMovie = { movieName: 'New Movie', theatreName: 'Theatre 1' };

            sinon.stub(Movie, 'findOne').returns(Promise.resolve(null)); 
            sinon.stub(Movie.prototype, 'save').returns(Promise.resolve(mockMovie)); 

            const response = await request(app)
                .post('/api/v1.0/moviebooking/movies/add/userId')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ movieName: 'New Movie', theatreName: 'Theatre 1' });

            expect(response.status).to.equal(201);

            expect(response.body.message).to.equal('Movie added successfully');

        });

        it('should return 400 if movie already exists', async () => {
            const mockMovie = { movieName: 'Existing Movie', theatreName: 'Theatre 1' };

            sinon.stub(Movie, 'findOne').returns(Promise.resolve(mockMovie));

            const response = await request(app)
                .post('/api/v1.0/moviebooking/movies/add/userId')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ movieName: 'Existing Movie', theatreName: 'Theatre 1' });
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Movie Already Present');
        });

        it('should return 500 if an error occurs', async () => {
            const mockMovie = { movieName: 'Error Movie', theatreName: 'Theatre 1' };

            sinon.stub(Movie, 'findOne').throws(new Error('Database error')); 

            const response = await request(app)
                .post('/api/v1.0/moviebooking/movies/add/userId')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ movieName: 'Error Movie', theatreName: 'Theatre 1' });
            expect(response.status).to.equal(500);
            expect(response.body.err).to.equal('Internal Server Error');
        });
    });


    describe('updateMovieService', () => {

        afterEach(() => {
            sinon.restore(); 
        });

        it('should update a movie successfully', async () => {
            const updatedData = { id: '60f72b2f9b1e8a001c1c8f74', movieName: 'Updated Movie', theatreName: 'Theatre 1' };
            const currentData = { id: '60f72b2f9b1e8a001c1c8f74', movieName: 'Initial Movie', theatreName: 'Theatre 2' };

            sinon.stub(Movie, 'findById').returns(Promise.resolve(currentData));
            sinon.stub(Movie, 'findByIdAndUpdate').returns(Promise.resolve(updatedData));

            const response = await request(app)
                .put(`/api/v1.0/moviebooking/movies/60f72b2f9b1e8a001c1c8f74/update/userId`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData);

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Movie updated successfully');
        });

        it('should return 400 if movie is not found', async () => {
            const nonExistentId = '60f72b2f9b1e8a001c1c8f74'; 

            sinon.stub(Movie, 'findById').returns(Promise.resolve(null));

            const response = await request(app)
                .put(`/api/v1.0/moviebooking/movies/${nonExistentId}/update/userId`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ movieName: 'Some Movie' });

            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Movie Not Present');
        });


        it('should return 500 if an error occurs', async () => {

            sinon.stub(Movie, 'findByIdAndUpdate').throws(new Error('Database error'));

            const response = await request(app)
                .put(`/api/v1.0/moviebooking/movies/234/update/userId`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ movieName: 'Error Movie' });

            expect(response.status).to.equal(500);
            expect(response.body.err).to.equal('Internal Server Error');
        });
    })


})
