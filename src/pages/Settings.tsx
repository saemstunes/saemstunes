
// Replace the line with displayName with a proper property access
// Assuming you want to use user.name or user.email as a fallback
const displayName = user?.name || user?.email || "User";
