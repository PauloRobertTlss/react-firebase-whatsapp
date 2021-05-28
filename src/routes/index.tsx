import {RouteProps} from "react-router-dom";
import Login from "../Pages/Login/Login";
import Home from "../Pages/Home";
import Chat from "../Pages/Chat";

export interface CustomRouteProps extends RouteProps {
    slug:  string,
    label: string
}

const routes: CustomRouteProps[] = [
    {
        slug: 'login',
        label: 'login',
        path: '/authentication',
        component: Login,
        exact: true,
    },
    {
        slug: 'chat',
        label: 'Network',
        path: '/rooms/:roomId',
        component: Chat,
        exact: true,
    },
    {
        slug: 'home',
        label: 'Home',
        path: '/',
        component: Home,
        exact: true,
    }
];

export default routes;