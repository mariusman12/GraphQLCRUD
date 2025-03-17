import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import db from './db.js';
const resolvers = {
    Query: {
        games() {
            return db.games;
        },
        reviews() {
            return db.reviews;
        },
        authors() {
            return db.authors;
        },
        review(_, args) {
            return db.reviews.find((review) => args.id === review.id);
        },
        game(_, args) {
            return db.games.find((game) => args.id === game.id);
        },
        author(_, args) {
            return db.authors.find((author) => args.id === author.id);
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((review) => review.game_id === parent.id);
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((review) => review.author_id === parent.id);
        }
    },
    Review: {
        author(parent) {
            return db.authors.find((author) => author.id === parent.author_id);
        },
        game(parent) {
            return db.games.find((game) => game.id === parent.game_id);
        }
    },
    Mutation: {
        deleteGame(_, args) {
            db.games = db.games.filter((game) => game.id !== args.id);
            return db.games;
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
