import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('_id')) {
            navigate('/');
        }
    })

    return (
        <h1>Dashboard</h1>
    )
}

export default Dashboard;