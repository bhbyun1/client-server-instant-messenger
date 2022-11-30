import React from 'react';
import {fireEvent, getByRole, getByTestId, render, screen} from '@testing-library/react';
import mockFetch from '../__mocks__/mockFetch';
import { Autocomplete, Box, DialogActions, TextField, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { shallow } from 'enzyme';
import { within } from '@testing-library/react';
import { useState } from 'react';
import { act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';

import CreateChat from '../src/components/CreateChat';

describe("CreateChat", () => {
    beforeEach(() => {
        sessionStorage.setItem('Username', 'bob')
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                'users': [
                    'john',
                    'luke',
                    'ken',
                    'marley'
                ]
            }),
            ok: true
        }))
    })

    it("renders without crashing", () => {
        shallow(<CreateChat
            onClose={(e) => console.log}
            selectedValue={''}
            open={true}/>);
    }),
    it("check things are not missing", () => {
        const app = shallow(<CreateChat
            onClose={(e) => console.log}
            selectedValue={''}
            open={true}/>);
        app.find(<Dialog
            open={true}
            onClose={(e) => console.log}/>);
        app.find(<DialogTitle/>);
        app.find(<DialogContent/>);
        app.find(<DialogActions/>);
        app.find(<TextField/>);
        app.find(<br/>);
    }),
    it("create a chat", async () => {
        const realUseState = React.useState;
        const mockInitialState = [
            'john',
            'luke',
            'ken',
            'marley'
        ];
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(mockInitialState));

        const app = await act (async () => render(<CreateChat
            onClose={(e) => console.log}
            selectedValue={''}
            open={true}/>)
        );

        const field  = screen.getByTestId('search-text-field').querySelector('input');
        expect(field).toBeInTheDocument();
    
        fireEvent.change(field , {target: { value: 'my chat'}});
        expect(field.value).toBe('my chat');

        const dropdownArrow = screen.getByTestId('ArrowDropDownIcon');
        fireEvent.click(dropdownArrow);

        const autocomplete = screen.getByTestId("autocomp");
        const input = within(autocomplete).getByRole('combobox');
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter'});
        expect(input.value).toBe('');
    })
}); 