import React from 'react';
import {render, screen} from '@testing-library/react';
import mockFetch from '../__mocks__/mockFetch';

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
        jest.spyOn(window, "fetch").mockImplementation(mockFetch);
    })

    it("teting123", () => {
        render(<ConversationPanel/>);
        console.log("123 foo");
    });
})


// const ConversationPanel = require('../src/components/ConversationPanel.js');

// jest.mock('../src/components/ConversationPanel.js');

// const mockMethod = jest.fn();

// ConversationPanel.mockImp

// it("test", async () => {
    
// })