import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { FriendRequestStatus } from 'generated/prisma/enums';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendsGateway {
  @WebSocketServer()
  server: Server;

  /**
   * FRIEND REQUEST SEND
   * When user sends a friend request
   */
  emitFriendRequestCreated(request: {
    id: string;
    senderId: string;
    receiverId: string;
    status: FriendRequestStatus;
    createdAt: Date;
  }) {
    // Receiver -> Getting new friend request
    this.server
      .to(`user:${request.receiverId}`)
      .emit('friend_request_received', request);

    // Sender -> is notified that request is sent.
    this.server.to(`user:${request.senderId}`).emit('friend_request_sent', {
      requestId: request.id,
      receiverId: request.receiverId,
    });
    console.log('Friend request created');
  }

  /**
   * FRIEND REQUEST REJECTED
   */
  emitFriendRequestRejected(data: {
    requestId: string;
    senderId: string;
    receiverId: string;
  }) {
    // Receiver -> Delete request from pending list
    this.server.to(`user:${data.receiverId}`).emit('friend_request_rejected', {
      requestId: data.requestId,
    });

    // Sender -> Rejected information
    this.server.to(`user:${data.senderId}`).emit('friend_request_rejected', {
      requestId: data.requestId,
    });
  }

  /**
   * FRIEND REQUEST ACCEPTED
   */
  // TODO: Change any to User type
  emitFriendRequestAccepted(data: {
    senderId: string;
    receiverId: string;
    sender: any;
    receiver: any;
  }) {
    // Receiver -> Add sender to friends list
    this.server.to(`user:${data.receiverId}`).emit('friend_request_accepted', {
      userId: data.senderId,
      friend: data.sender,
    });

    // Sender -> Add receiver to friends list
    this.server.to(`user:${data.senderId}`).emit('friend_request_accepted', {
      userId: data.receiverId,
      friend: data.receiver,
    });
  }
}
