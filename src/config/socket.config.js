const { Server } = require('socket.io');
const { productsModel } = require('../dao/MONGO/models/products.model.js');
const { chatsModel } = require('../dao/MONGO/models/chat.model.js');
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const { usersModel } = require('../dao/MONGO/models/users.model.js');

let io;

function initSocket(httpServer, sessionMiddleware) {
    // Compartir la sesión entre HTTP y Socket.io
    io = new Server(httpServer, {
        cors: {
            origin: 'https://lessenza.onrender.com',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Usar el middleware de sesión de express con Socket.io
    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on('connection', async (socket) => {
        const session = socket.request.session;

        if (!session || !session.passport || !session.passport.user) {
            console.error('No session or user found');
            return;
        }

        const userId = session.passport.user;
        console.log('User connected with ID:', userId);

        try {
            // Buscar el usuario actual
            const user = await usersModel.findById(userId);
            if (!user) {
                console.error('User not found');
                return;
            }

            socket.userId = user._id;
            socket.userRole = user.role;

            console.log('New user connected:', user.email);

            // Enviar productos iniciales según el rol del usuario
            let products;
            if (socket.userRole === 'admin') {
                products = await productsModel.find({});
            } else if (socket.userRole === 'premium') {
                products = await productsModel.find({ createdBy: socket.userId });
            }
            socket.emit('update-products', products);

            // Enviar mensajes iniciales de chat
            const messages = await chatsModel.find({});
            socket.emit('initial-messages', messages);
        } catch (error) {
            console.error('Error occurred while fetching initial data:', error);
        }

        // Manejar la obtención de productos
        socket.on('get-products', async () => {
            try {
                let products;
                if (socket.userRole === 'admin') {
                    products = await productsModel.find({});
                } else if (socket.userRole === 'premium') {
                    products = await productsModel.find({ createdBy: socket.userId });
                }
                socket.emit('update-products', products);
            } catch (error) {
                console.error('Error occurred while fetching products:', error);
            }
        });

        // Manejar la adición de productos
        socket.on('add-product', async (product) => {
            try {
                console.log('Adding product:', product);
                const newProduct = await productsModel.create({ ...product, createdBy: socket.userId });
                let updatedProducts;
                if (socket.userRole === 'admin') {
                    updatedProducts = await productsModel.find({});
                } else {
                    updatedProducts = await productsModel.find({ createdBy: socket.userId });
                }
                io.emit('update-products', updatedProducts);
            } catch (error) {
                console.error('Error occurred while adding product:', error);
            }
        });

        // Manejar la eliminación de productos
        socket.on('delete-product', async (productId) => {
            try {
                console.log('Deleting product with ID:', productId);
                const product = await productsModel.findById(productId);

                if (!product) {
                    io.to(socket.id).emit('product-not-found');
                    return;
                }

                // Si el usuario es premium, solo puede eliminar sus propios productos
                if (socket.userRole === 'premium' && product.createdBy.toString() !== socket.userId.toString()) {
                    io.to(socket.id).emit('not-authorized');
                    return;
                }

                await productsModel.findByIdAndDelete(productId);
                let updatedProducts;
                if (socket.userRole === 'admin') {
                    updatedProducts = await productsModel.find({});
                } else {
                    updatedProducts = await productsModel.find({ createdBy: socket.userId });
                }
                io.emit('update-products', updatedProducts);
            } catch (error) {
                console.error('Error occurred while deleting product:', error);
            }
        });

        // Manejar los mensajes de chat
        socket.on('chat message', async (msg) => {
            console.log('Received chat message:', msg);
            try {
                const newMessage = new chatsModel({ email: msg.user, message: msg.message });
                const savedMessage = await newMessage.save();
                console.log('Saved message:', savedMessage);
                io.emit('chat message', msg);
            } catch (error) {
                console.error('Error occurred while saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

module.exports = { initSocket, getIO };
