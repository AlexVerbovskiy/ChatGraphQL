require("dotenv").config()

const {
    createServer
} = require("http");
const express = require("express");
const {
    ApolloServer,
    gql
} = require("apollo-server-express");
const {
    ApolloServerPluginDrainHttpServer
} = require("apollo-server-core");
const {
    PubSub
} = require("graphql-subscriptions");
const {
    makeExecutableSchema
} = require("@graphql-tools/schema");
const {
    WebSocketServer
} = require("ws");
const {
    useServer
} = require("graphql-ws/lib/use/ws");
const multer = require('multer');
const upload = multer();
const cors = require('cors');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const mongoose = require("mongoose");

const router = require("./routers/index")

const PORT = process.env.PORT || 4000;
const MONGODB = "";
const pubsub = new PubSub();

const start = async () => {

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    });

    // Create an Express app and HTTP server; we will attach the WebSocket
    // server and the ApolloServer to this HTTP server.
    const app = express();
    const httpServer = createServer(app);

    const urlencodedParser = express.urlencoded({
        extended: true,
        limit: '50mb'
    });

    app.use(express.json({
        limit: '50mb'
    }));
    app.use(urlencodedParser);
    app.use(upload.array());
    app.use(cors({
        credentials: true,
        //origin: process.env.CLIENT_URL
    }));

    app.use("/api", router)

    // Set up WebSocket server.
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });
    const serverCleanup = useServer({
        schema
    }, wsServer);

    // Set up ApolloServer.
    const server = new ApolloServer({
        schema,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({
                httpServer
            }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();
    server.applyMiddleware({
        app
    });

    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true
    })

    // Now that our HTTP server is fully set up, actually listen.
    httpServer.listen(PORT, () => {
        console.log(
            `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
        );
        console.log(
            `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
        );
    });
}
start();