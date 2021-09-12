const users = [];

const addUser = (id, name, lobby) => {
  const existingUser = users.find(
    (user) => user.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );

  if (existingUser) return { error: 'Username has already been taken' };
  if (!name && !lobby) return { error: 'Username and room are required' };
  if (!name) return { error: 'Username is required' };
  if (!lobby) return { error: 'Room is required' };

  const user = { id, name, lobby };
  users.push(user);
  console.log('be-users: ', users);
  return { user };
};

const getUser = (id) => {
  let user = users.find((user) => user.id == id);
  return user;
};

const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUsers = (lobby) => users.filter((user) => user.lobby === lobby);

module.exports = { addUser, getUser, deleteUser, getUsers };
