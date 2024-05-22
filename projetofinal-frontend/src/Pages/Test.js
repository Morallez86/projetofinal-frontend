import jwt_decode from "jwt-decode";

// Assuming you have received a JWT token from the backend
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Decode the token
const decodedToken = jwt_decode(token);

// Extract information from the decoded token
const userId = decodedToken.sub;
const username = decodedToken.name;
const expirationTime = decodedToken.exp;

console.log("User ID:", userId);
console.log("Username:", username);
console.log("Expiration Time:", expirationTime);