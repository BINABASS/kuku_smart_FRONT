import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';

function createMockStore(initialState = {}) {
    return configureStore({
        reducer: {
            auth: authReducer,
        },
        preloadedState: initialState
    });
}

function render(ui, { route = '/', store = createMockStore(), ...renderOptions } = {}) {
    window.history.pushState({}, 'Test page', route);

    return rtlRender(
        <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>
                {ui}
            </MemoryRouter>
        </Provider>,
        renderOptions
    );
}

export { render, screen, waitFor, userEvent };
