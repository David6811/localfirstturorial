'use client';
import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import "./index.css";

export default function ProfileClient() {
    const { user, error, isLoading } = useUser();
    console.log("Auth0 User: ", user);
    const userPicture = user?.picture || 'https://anycopy.io/favicon.ico';

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <div className="header-row">
            {user ? (
                <>
                    <div>
                        <img
                            src={userPicture}
                            alt={user.name || 'User'}
                            className="user-avatar"
                        />
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </div>
                    <div className="auth-buttons">
                        <button onClick={() => window.location.href = "/api/auth/logout"}>
                            Logout
                        </button>
                    </div>
                </>
            ) : (
                <div className="auth-buttons">
                    <button onClick={() => window.location.href = "/api/auth/login"}>
                        Login
                    </button>
                </div>
            )}
        </div>
    );
}
