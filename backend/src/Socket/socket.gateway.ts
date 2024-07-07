import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1', 'http://localhost:4173', 'https://projet-web-choco-fred-sofiane-frontend.onrender.com/'];

@WebSocketGateway({
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);

        client.on('joinRoom', (room: string) => {
            client.join(room);
            console.log(`Client ${client.id} joined room: ${room}`);
        });

        client.on('disconnect', () => {
            console.log(`Client disconnected: ${client.id}`);
        });
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    sendMessage(conversationId: string) {
        console.log(`Sending message to conversation: ${conversationId}`);
        this.server.to(conversationId).emit('newMessage', { conversationId });
    }
}
