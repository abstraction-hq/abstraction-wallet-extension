import { createMemoryRouter } from 'react-router-dom';

import HomePage from '~views/home';
import WelcomeView from '~views/welcome';
import CreateView from '~views/create';

export const routers = createMemoryRouter([
    {
        path: '/',
        Component: WelcomeView
    },
    {
        path: '/home',
        Component: HomePage
    },
    {
        path: "/create",
        Component: CreateView
    },
])