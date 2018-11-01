'use strict';

const Handlers = require('./handlers')

const Hapi = require('hapi');

const Joi = require('joi');

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email({ minDomainAtoms: 2 })
})

const result = Joi.validate({ username: 'abc', birthyear: 1994 }, schema);

const todo = {
    name:'todo',
    version: '0.0.1',
    register: async function (server, options) {

        server.route({
            method: 'GET',
            path: '/',
            handler: Handlers.accueil
        });

        server.route({
            method: 'GET',
            path: '/all',
            handler: Handlers.all
        });

        server.route({
            method: 'GET',
            path: '/type/{name}',
            handler: Handlers.type
        });

        server.route({
            method: 'GET',
            path: '/weapontype/{name}',
            handler: Handlers.weapontype
        });

        server.route({
            method: ['POST', 'PUT'],
            path: '/post',
            handler: Handlers.post
        });
        
        server.route({
            method: 'PUT',
            path: '/put',
            handler:Handlers.put
        });

        server.route({
            method: 'DELETE',
            path: '/delete',
            handler:Handlers.delete
        });
        
        server.route({
            method: 'GET',
            path: '/{name}',
            handler: (request, h) => {
        
                return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
            }
        });

        server.route({
            method: [ 'PUT', 'POST' ],
            path: '/putpost',
            config: {
                payload: {
                    parse: true
                }
            },
            handler: Handlers.putpost
        });

    }
}
module.exports = todo;