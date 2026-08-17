import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import HomePage from "../../fearures/home/HomePage";
import ActivityDashboard from "../../fearures/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../fearures/activities/form/ActivityForm";
import ActivityDetailsPage from "../../fearures/activities/details/ActivityDetailsPage";
import Counter from "../../fearures/counter/Counter";
import TestErrors from "../../fearures/errors/TestErrors";
import NotFound from "../../fearures/errors/NotFound";
import ServerError from "../../fearures/errors/ServerError";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "activities", element: <ActivityDashboard /> },
            { path: "activities/:id", element: <ActivityDetailsPage /> },
            { path: "createActivity", element: <ActivityForm key="create" /> },
            { path: "manage/:id", element: <ActivityForm /> },
            { path: "counter", element: <Counter /> },
            { path: "errors", element: <TestErrors /> },
            { path: "not-found", element: <NotFound /> },
            { path: "server-error", element: <ServerError /> },
            { path: "*", element: <Navigate replace to="/not-found" /> }
        ]
    }
])