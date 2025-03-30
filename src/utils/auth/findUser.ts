import { eq } from "drizzle-orm";
import user from "../../models/user.ts";
import { db } from "../db/index.ts";

export const findUserOrAdd = async (userEmail: string, userName: string) => {
    // Fetch the user from the database
    let userObj = await db.select().from(user).where(eq(user.email, userEmail)).execute();
    
    // If the user does not exist, create the user and return true
    if (userObj.length === 0) {
        await db.insert(user).values({ email: userEmail, name: userName, role: "User"});
    }

    return userObj[0]
};