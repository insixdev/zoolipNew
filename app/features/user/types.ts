export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  // Add other user properties as needed
  [key: string]: any;
}
