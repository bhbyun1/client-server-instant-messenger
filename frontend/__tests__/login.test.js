import React from 'react';
import {fireEvent, getByRole, getByTestId, render, screen} from '@testing-library/react';
import mockFetch from '../__mocks__/mockFetch';
import { Autocomplete, Box, Button, TextField, Typography, Menu } from '@mui/material';
import { shallow } from 'enzyme';
import { within } from '@testing-library/react';
import { useState } from 'react';
import { act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
//import { useRouter } from 'next/router'

import Login from '../src/pages/login';

import { useRouter } from "next/router";

const mockPush = jest.fn()
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: "",
            asPath: "",
            push: mockPush
        };
    },
}));

describe("Login", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                'token': '1234abcd'
            })
        }))
    })

    it("renders without crashing", () => {
        shallow(<Login/>);
    }),
    it("check things are not missing", () => {
        act (() => render(<Login/>));
        // These should throw an error if they are not rendered
        const username_field = screen.getByTestId("username");
        const password_field = screen.getByTestId("password");
        const submit_button = screen.getByTestId("submit");
        
    }),
    it("check login succeeds when fetch returns token", async () => {
        var mockStorage = {'initial': 'data'};
        global.Storage.prototype.setItem = jest.fn((key, value) => {
            mockStorage[key] = value;
            console.log(JSON.stringify(mockStorage));
        });
        act (() => render(<Login/>));
        // These should throw an error if they are not rendered
        const username_field = screen.getByTestId("username").querySelector('input');
        const password_field = screen.getByTestId("password").querySelector('input');
        const submit_button = screen.getByTestId("submit");
        
        act (() => {
            fireEvent.change(username_field, {target: {value: 'Robert'}});
            fireEvent.change(password_field, {target: {value: 'RobertPassword***'}});
            fireEvent.click(submit_button);
        });
        expect(mockStorage).toBeTruthy();
    })
    it("check login fails when fetch returns no token", async () => {
        var mockStorage = {};
        global.Storage.prototype.setItem = jest.fn((key, value) => {
            mockStorage[key] = value;
            console.log(JSON.stringify(mockStorage));
        });

        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                'message': 'Invalid username or password.'
            })
        }))
        act (() => render(<Login/>));


        // These should throw an error if they are not rendered
        const username_field = screen.getByTestId("username").querySelector('input');
        const password_field = screen.getByTestId("password").querySelector('input');
        const submit_button = screen.getByTestId("submit");
        let alertComponent = screen.queryByTestId('alert');
        expect(alertComponent).toBeFalsy(); // Error alert should not be visible
        
        act (() => {
            fireEvent.change(username_field, {target: {value: 'Robert'}});
            fireEvent.change(password_field, {target: {value: 'RobertPassword***'}});
            fireEvent.click(submit_button);
        });
        expect(mockStorage).toStrictEqual({}); // Session storage should be empty still
        alertComponent = await screen.findByTestId('alert');
        expect(alertComponent).toBeTruthy(); // Error alert should have appeared now
    })
})
