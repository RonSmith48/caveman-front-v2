export default function useUser() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (accessToken && user) {
    return { user, accessToken, refreshToken };
  }

  return { user: null, accessToken: null, refreshToken: null };
}
