import React from 'react';
import {render, screen} from '@testing-library/react';
import mockFetch from '../__mocks__/mockFetch';
import { Box } from '@mui/material';

import ConversationPanel from '../src/pages/components/ConversationPanel';

describe("ConversationPanel", () => {
    // let originalFetch;

    // beforeEach(() => {
    //     originalFetch = global.fetch;
    //     global.fetch = jest.fn(() => Promise.resolve({
    //         json: () => Promise.resolve({
    //             value: "Testing something!"
    //         })
    //     }));
    // });

    // afterEach(() => {
    //     global.fetch = originalFetch;
    // });

    beforeEach(() => {
        // jest.spyOn(window, "fetch").mockImplementation(mockFetch);
        // globalThis.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        //     json: () => Promise.resolve ({
        //         mockFetch
        //     })
        // }))
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
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
            })
        }))
    })

    it("renders without crashing", () => {
        render(<ConversationPanel/>);
    }),
    it("check things are not missing", () => {
        render(<ConversationPanel/>);
    });
})


// const ConversationPanel = require('../src/components/ConversationPanel.js');

// jest.mock('../src/components/ConversationPanel.js');

// const mockMethod = jest.fn();

// ConversationPanel.mockImp

// it("test", async () => {
    
// })