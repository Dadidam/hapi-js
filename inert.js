const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const server = new Hapi.Server();

server.connection({
    port: 1337,
    host: '127.0.0.1'
});

server.register(Inert, (err) => {
    if (err) {
        throw err;
    }
/*
    // simple static web-server handler
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: Path.join(__dirname, 'public'),
                listing: true
            }
        }
        /* OR ...
        handler: {   // <== call-all not found route
            file: '404.html'
        }
        
    });
*/
/* OR ...
    //use decorated reply
    server.route({
        method: 'GET',
        path: '/{file*}',
        handler: function(request, reply) {
            const path = `${request.params.file}.html`;
            
            return reply.file(path);
        }
    })
*/
    // OR ...
    // serve static html and image files
    server.route({
        method: 'GET',
        path: '/{files*}',
        handler: {
            directory: {
                path: __dirname
            }
        }
    });

    // return not found page if handler returns a 404
    server.ext('onPostHandler', function(request, reply) {
        const response = request.response;

        if (response.isBoom && response.output.statusCode === 404) {
            return reply.file('./404.html').code(404);
        }

        return reply.continue();
    })

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at ${server.info.uri}`);
    });
});
