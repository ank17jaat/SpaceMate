import { Clerk, verifyToken } from "@clerk/backend";

const secretKey = process.env.CLERK_SECRET_KEY;

export const clerkClient = secretKey ? Clerk({ secretKey }) : null;

function getAuthorizedParties() {
  return [
    process.env.CLERK_AUTHORIZED_PARTIES,
    process.env.FRONTEND_URL,
    process.env.APP_URL,
    process.env.NETLIFY_URL,
  ]
    .filter(Boolean)
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function verifyClerkSessionToken(token: string) {
  if (!secretKey) {
    throw new Error("Missing CLERK_SECRET_KEY");
  }

  return verifyToken(token, {
    secretKey,
    issuer: process.env.CLERK_JWT_ISSUER ?? null,
    authorizedParties: getAuthorizedParties(),
  });
}

export async function getClerkUserProfile(userId: string) {
  if (!clerkClient) {
    throw new Error("Missing CLERK_SECRET_KEY");
  }

  const user = await clerkClient.users.getUser(userId);
  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  );

  return {
    userId: user.id,
    email: primaryEmail?.emailAddress || "",
    name:
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.username ||
      "Guest",
  };
}
