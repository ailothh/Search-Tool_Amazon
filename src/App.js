import React, { useState } from 'react';

function UserSearch() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/search?first_name=${firstName}&last_name=${lastName}`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred');
        setUser(null);
      } else {
        const data = await response.json();
        setUser(data.user);
        setError(null);
      }
    } catch (error) {
      setError('Failed to fetch user data');
      setUser(null);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <h3>User Found:</h3>
          <p>Name: {user.first_name} {user.last_name}</p>
          {/* Display other fields as needed */}
        </div>
      )}
    </div>
  );
}

export default UserSearch;