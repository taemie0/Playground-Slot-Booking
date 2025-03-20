// // src/auth.d.ts
// import "@auth/core/types";

// declare module "@auth/core/types" {
//   interface User {
//     sub?: string; // Add the `sub` property [[8]][[9]]
//   }
// }

// declare namespace App {
//     interface Locals {
//       auth: () => Promise<{ user: { id: string; email: string; name: string }; accessToken: string }>;
//     }
  
//     interface PageServerParentData {
//       session: {
//         id: string;
//         email: string;
//         name: string;
//       };
//     }
//   }