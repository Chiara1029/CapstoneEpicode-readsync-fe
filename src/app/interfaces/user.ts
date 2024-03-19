export interface User {
  username: string | null;
  name: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  avatar: string | null;
  userRole: string | null;
}

export interface UserResponse {
  id: string | null;
  username: string | null;
  name: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  avatar: string | null;
  userRole: string | null;
}
