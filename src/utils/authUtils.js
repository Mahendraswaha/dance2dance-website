// src/utils/authUtils.js

const ADMIN_EMAILS = [
  'mahendra.swaha@gmail.com',
  'contato@dance2dance.no'
];

export const isAdmin = (user) => {
  if (!user) return false;
  if (ADMIN_EMAILS.includes(user.email)) return true;
  if (user.profile?.role === 'admin') return true;
  return false;
};

export const isInstructor = (user) => {
  if (!user) return false;
  if (isAdmin(user)) return true; // Admins have instructor privileges
  if (user.profile?.role === 'instructor') return true;
  return false;
};
