import React from 'react';
import Avatar from 'react-avatar';

function UserProfile({ username }) {
    // Generate a random URL for the avatar
    const avatarUrl = `https://i.pravatar.cc/300?u=${username}-${Math.random()}`;

    return (
        <div className='d-flex align-items-center mb-3'>
            <Avatar
                className='mr-3'
                name={username.toString()}
                size={50}
                round="40px"
                src={avatarUrl} // Use the Pravatar URL
            />
            <span className='mx-2'>{username.toString()}</span>
        </div>
    );
}

export default UserProfile;
