const expect = require('chai').expect;
const request = require('supertest');

const router = require('../../routes/api/playlist.route');
const app = require('../../app');

describe('Playlist Route', function() {
    // before((done) => {

    // }
    describe('Get all playlists by user', function() {
        it('Should error out if no name provided ', function() {
            request(app).get('/api/playlists/all')
                .then(res => {
                    console.log('res: ', res);
                    const { body } = res.body;
                    console.log('HELOO!!!!!');
                    expect(res.body.length).to.greaterThan(100);
                })
                .catch(err => {
                    console.log('err: ', err);
                })
                .then(() => {
                    // console.log('last ditch');
                    
                });
            console.log('kbavkubskvs');
            
        })
    })
});







// const expect = require('chai').expect;
// const express = require('express');
// const sinon = require('sinon');

// const router = require('../../routes/api/playlist.route');

// console.log('router', router);

// let req = {
//     body: {},
// };

// let res = {
//     sendCalledWith: '',
//     send: function(arg) { 
//         this.sendCalledWith = arg;
//     }
// };

// describe('Playlist Route', function() {
//     describe('Get all playlists by user', function() {
//         it('Should error out if no name provided ', function() {
//             hello(req, res);
//             expect(res.sendCalledWith).to.contain('error');
//         });
//     })
// });