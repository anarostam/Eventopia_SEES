import React from 'react';

function UserList({ users, currentUserId, onSelectUser }) {
  return (
    <div>
      <h3>Online Users:</h3>
      {users
        .filter((user) => user.id !== currentUserId)
        .map((user) => (
          <div key={user.id}>
            <button onClick={() => onSelectUser(user)}>{user.name}</button>
          </div>
        ))}
    </div>
  );
}

export default UserList;
