import React from 'react';
import {fireEvent, getByRole, getByTestId, render, screen} from '@testing-library/react';
import mockFetch from '../__mocks__/mockFetch';
import { Autocomplete, Box, Typography } from '@mui/material';
import { shallow } from 'enzyme';
import { within } from '@testing-library/react';
import { useState } from 'react';
import { act } from '@testing-library/react';

import ConversationPanel from '../src/pages/components/ConversationPanel';

describe("ConversationPanel", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                'chatrooms': [{
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
                },
                {
                    'name': 'test chat 2a',
                    'owner': 'notjohn',
                    'users': ['notjohn', 'luke', 'gabe'],
                    'public_id': '5b61fe4c-25e9-41f5-8132-52847a72ae4d',
                    'messages': [{
                        'id': '581e58ca-ab5f-4921-81db-e3df5334fe8d',
                        'sent': '2020-07-10 15:00:00.000',
                        'username': 'notjohn',
                        'chatroom': '5b61fe4c-25e9-41f5-8132-52847a72ae4d',
                        'message': 'hey im notjohn'
                    }]
                }]
            })
        }))
    })

    it("renders without crashing", () => {
        shallow(<ConversationPanel/>);
    }),
    it("check things are not missing", () => {
        const app = shallow(<ConversationPanel/>);
        app.find(<Box/>);
        app.find(<Typography/>);
    }),
    it("check fetch is correct", async () => {
        sessionStorage.setItem('Username', 'luke');
        const realUseState = React.useState;
        const mockInitialState = [
            {'label': 'test chat 1', 'id': '5ccf382c-aa84-49cb-b348-55cc53f53f0f'},
            {'label': 'test chat 2a', 'id': '5b61fe4c-25e9-41f5-8132-52847a72ae4d'}
        ];
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(mockInitialState));
        const app = await act (async () => render(<ConversationPanel setConversationMessages={(e) => console.log(e)}/>));
        const autocomplete = await screen.getByTestId("autocomp");
        const input = within(autocomplete).getByRole('combobox');

        const dropdownButton = within(autocomplete).getByTestId('ArrowDropDownIcon');
        fireEvent.click(dropdownButton);
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter'});
        expect(input.value).toBe('test chat 1');
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter'});
        expect(input.value).toBe('test chat 2a');
    })
})
