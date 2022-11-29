const chatList = {
    'chatrooms': {
        'name': 'test chat 1',
        'owner': 'john',
        'users': ['john', 'luke', 'gabe'],
        'public_id': '5ccf382c-aa84-49cb-b348-55cc53f53f0f',
        'messages': [{
            'id': '7a61658b-9136-4720-b1b6-43c2a264243e',
            'sent': '2020-07-10 15:00:00.000',
            'username': 'john',
            'chatroom': '5ccf382c-aa84-49cb-b348-55cc53f53f0f',
            'message': 'hey im john'
        }]
    }
};

const chatMessages = {
    'messages': [{
        'id': '7a61658b-9136-4720-b1b6-43c2a264243e',
        'sent': '2020-07-10 15:00:00.000',
        'username': 'john',
        'chatroom': '5ccf382c-aa84-49cb-b348-55cc53f53f0f',
        'message': 'hey im john'
    }]
};

export default async function mockFetch(url) {
    switch (url) {
        case "http://localhost:5000/chat/": {
            return {
                ok: true,
                status: 200,
                json: async () => chatList,
            };
        }
        case "https://localhost:5000/chat/5ccf382c-aa84-49cb-b348-55cc53f53f0f": {
            return {
                ok: true,
                status: 200,
                json: async () => chatMessages
            };
        }
        default: {
            throw new Error(`Unhandled request: ${url}`);
        }
    }
}