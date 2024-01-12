import { Level } from "level";
import crypto from "crypto";

const SHA256 = (message: string) => crypto.createHash("sha256").update(message).digest("hex");

export interface AuthOptions {
    username?: string;
    password?: string;
    authkey?: string;
}

export interface AuthResult {
    error: boolean;
    message: any;
}

export async function verifyAuth(options: AuthOptions, db: Level): Promise<AuthResult> {
    // Verify username-password authentication
    if (typeof options.username === "string" && typeof options.password === "string" && options.password !== "") {
        let userInfo;

        // Get user info and verify credentials
        try {
            userInfo = JSON.parse(await db.get("USER_INFO" + options.username));

            // Verify password            
            if (userInfo.passwordHash !== SHA256(options.password)) {
                return {
                    error: true,
                    message: "Incorrect password."
                };
            }

            return {
                error: false,
                message: userInfo
            }
        } catch (e) {
            return {
                error: true,
                message: "Account does not exist."
            };
        }
    } else if (typeof options.username === "string" && typeof options.authkey === "string") { // Verify authkey authentication    
        // Verify authkey
        try {
            let authkeyInfo;

            // Check if authkey exists or not
            try {
                authkeyInfo = JSON.parse(await db.get("AUTHKEY" + options.authkey));
            } catch (e) {
                return {
                    error: true,
                    message: "Can not get authkey info."
                }
            }

            // Check if authkey matches with specified account
            if (authkeyInfo.owner !== options.username) {
                return {
                    error: true,
                    message: "Authkey can not be used for specified account."
                }
            }

            // Check if account exists at all
            let userInfo;

            try {
                userInfo = JSON.parse(await db.get("USER_INFO" + options.username));
            } catch (e) {
                return {
                    error: true,
                    message: "Can not get account info."
                }
            }

            return {
                error: false,
                message: userInfo
            }
        } catch (e) {
            return {
                error: true,
                message: "Can not retrieve authkey info."
            }
        }
    }
    
    // Bad request form
    return {
        error: true,
        message: "Bad request form."
    };
}
