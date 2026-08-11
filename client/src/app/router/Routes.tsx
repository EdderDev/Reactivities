import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../../fearures/home/HomePage";
import ActivityDashboard from "../../fearures/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../fearures/activities/form/ActivityForm";
import ActivityDetails from "../../fearures/activities/details/ActivityDetails";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {path: "", element: <HomePage />},
            {path: "activities", element: <ActivityDashboard />},
            {path: "activities/:id", element: <ActivityDetails />},
            {path: "createActivity", element: <ActivityForm key="create"/>},
            {path: "manage/:id", element: <ActivityForm />}
        ]
    }
])