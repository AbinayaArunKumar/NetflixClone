// src/Pages/AdminDashboard.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div style={styles.dashboardContainer}>
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>Admin Menu</h2>
                <ul style={styles.sidebarList}>
                    <li style={styles.sidebarItem}>
                        <NavLink 
                            to="/admin/dashboard/movies" 
                            style={({ isActive }) => ({
                                ...styles.link,
                                fontWeight: isActive ? 'bold' : 'normal',
                                color: isActive ? '#ffd700' : '#ffffff' // Change color when active
                            })}>
                            Movies
                        </NavLink>
                        
                    </li>
                    <li style={styles.sidebarItem}>
                        <NavLink 
                            to="/admin/dashboard/genres" 
                            style={({ isActive }) => ({
                                ...styles.link,
                                fontWeight: isActive ? 'bold' : 'normal',
                                color: isActive ? '#ffd700' : '#ffffff' // Change color when active
                            })}>
                            Genres
                        </NavLink>


                    </li>
                    <li style={styles.sidebarItem}>
                        <NavLink 
                            to="/admin/dashboard/actors" 
                            style={({ isActive }) => ({
                                ...styles.link,
                                fontWeight: isActive ? 'bold' : 'normal',
                                color: isActive ? '#ffd700' : '#ffffff' // Change color when active
                            })}>
                            Actors
                        </NavLink>


                    </li>
                    <li style={styles.sidebarItem}>
                        <NavLink 
                            to="/admin/dashboard/add-actors" 
                            style={({ isActive }) => ({
                                ...styles.link,
                                fontWeight: isActive ? 'bold' : 'normal',
                                color: isActive ? '#ffd700' : '#ffffff' // Change color when active
                            })}>
                            Add Actors
                        </NavLink>


                    </li>
                    {/* Additional categories can be added here later */}
                </ul>
            </div>
            <div style={styles.content}>
                <h2 style={styles.pageTitle}>Welcome to the Admin Dashboard</h2>
                <p style={styles.pageDescription}>Select an option from the menu to begin managing content.</p>
                <Outlet /> {/* Render nested route content here */}
            </div>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        color: '#fff',
        backgroundColor: '#121212',
        display: 'flex',
        minHeight: '100vh',
    },
    sidebar: {
        width: '200px',
        backgroundColor: '#1e1e1e',
        padding: '20px',
        borderRadius: '8px',
    },
    sidebarTitle: {
        fontSize: '24px',
        margin: '40px 0 20px 0',
        textAlign: 'left',
    },
    sidebarList: {
        listStyle: 'none',
        padding: 0,
    },
    sidebarItem: {
        marginBottom: '15px',
    },
    link: {
        color: '#ffffff',
        textDecoration: 'none',
    },
    content: {
        padding: '20px',
        flex: 1,
        color: '#fff',
    },
    pageTitle: {
        fontSize: '24px',
    },
    pageDescription: {
        fontSize: '16px',
        marginTop: '10px',
    },
};

export default AdminDashboard;
