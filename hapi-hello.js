const Hapi = require('hapi');
const Blipp = require('blipp');
const server = new Hapi.Server();

server.connection({
    port: 1337,
    host: '127.0.0.1'
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        return reply('Hello Hapi World\n');
    }
});

// Reply with Error() object
server.route({
    method: 'GET',
    path: '/err',
    handler: function(request, reply) {
        return reply(new Error());
    }
});
// ---------- Custom handlers -------------------- //
// Create custom handler for `reply`
const hello = function(name) {
    return this.repsonse({
        hello: name
    });
}
server.decorate('reply', 'hello', hello);
server.route({
    method: 'GET',
    path: '/custom/{name}',
    handler: function(request, reply) {
        return reply.hello(request.params.name); // <== use our custom `hello` handler
    }
});

// Or... Defines new handler for routes on this server
server.handler('hello', (route, options) => {
    return function(request, reply) {
        const hello = options.customHello || 'Hello';
        const name = request.params.name;

        return reply(`${hello} ${name}`);
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: {
        hello: {
            customHello: 'Welcome'
        }
    }
});
// ---------- End of Custom handlers -------------- //

// Other routes for other methods
server.route({
    method: '*',
    path: '/{p*}',
    handler: function(request, reply) {
        return reply('The page was not found').code(404).type('text/plain').header('X-Custom', 'value');
    }
});

server.route({
    method: 'GET',
    path: '/hello/{name}',
    config: {
        description: 'Return an object with hello message',
        validate: {
            params: {
                //name: Joi.string().min(3).required()
            }
        },
        pre: [],
        handler: function (request, reply) {
            const name = request.params.name;
            return reply({
                message: `Hello, ${name}`
            });
        },
        cache: {
            expiresIn: 3600000
        }
    },
});

server.register(Blipp, (err) => {
    if (err) {
        throw err;
    }

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at ${server.info.uri}`);
    });
});
