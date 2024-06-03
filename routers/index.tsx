import { createMemoryRouter } from 'react-router-dom';
import LoginPage from '@/views/login';
import HomePage from '@/views/home';
import WelcomeView from '@/views/welcome';
import CreateWalletPage from '@/views/create';

export const routers = createMemoryRouter([
    {
        path: '/',
        Component: WelcomeView
    },
    {
        path: '/login',
        Component: LoginPage
    },
    {
        path: '/home',
        Component: HomePage
    },
    {
        path: "/create",
        Component: CreateWalletPage
    }
])
