import DOMPurify from 'dompurify';

import {Message, DataType} from "./message";

export const setupChat = () => {
    const socket = setupChatServerConn();
    handleMessageBroadcast(socket);
    handleMessageSubmission(socket);
};

const setupChatServerConn = () => {
    return new WebSocket('ws://localhost:8080/f10a5ea1-ff13-4598-8879-d1796e415c78');
}

const handleMessageBroadcast = (socket: WebSocket) => {
    socket.addEventListener('message', (event) => {
        const eventData = JSON.parse(event.data) as Message;

        switch (eventData.kind) {
            case DataType.Connect:
                console.log('Connected: ', eventData.content);

                break;
            case DataType.Disconnect:
                console.log('Disconnected: ', eventData.content);

                break;
            case DataType.Message:
                addMessage(eventData);

                break;
            default:
                console.debug(eventData);
        }
    });
};

const addMessage = (message: Message) => {
    const messages = document.getElementById('chat_messages') as HTMLUListElement;

    // `<li class="chat-message">
    //      <div class="user-info-container">
    //          <p class="username">${message.user_id}</p>
    //      </div>
    //      <p class="message-content">${message.content}</p>
    //  </li>`

    // TODO Do this more simply
    const messageEl = document.createElement('li');
    messageEl.classList.add('chat-message');

    const userContainer = document.createElement('div');
    userContainer.classList.add('user-info-container');
    messageEl.append(userContainer);

    const username = document.createElement('p');
    username.classList.add('username');
    username.textContent = DOMPurify.sanitize(message.user_id || '');
    userContainer.append(username)

    const messageContent = document.createElement('p');
    messageContent.classList.add('message-content');
    messageContent.textContent = DOMPurify.sanitize(message.content);
    messageEl.append(messageContent);

    messages.append(messageEl)
};


const handleMessageSubmission = (socket: WebSocket) => {
    const newMessageForm = document.getElementById('new_chat_message') as HTMLFormElement;

    newMessageForm.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        const formData = new FormData(newMessageForm);
        const formContents = formData.get('new_message_text');
        if (formContents) {
            socket.send(formContents);
        } else {
            console.error('No message to send');
        }
    });
}