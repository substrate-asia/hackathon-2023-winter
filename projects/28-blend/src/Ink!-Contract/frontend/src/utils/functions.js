// import AWS from "aws-sdk";
import axios from "axios";
import { ApiPromise, WsProvider } from "@polkadot/api";

export function getCurrentTimeFormatted() {
    const currentDate = new Date();

    // Get the date components
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Month is zero-based
    const year = currentDate.getFullYear();

    // Get the time components
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Pad single-digit day, month, and minutes with leading zeros
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Construct the formatted date and time string
    const formattedDateTime = `${formattedMonth}/${formattedDay}/${year} ${formattedHours}:${formattedMinutes}${ampm}`;

    return formattedDateTime;
}

export const transferFunds = async (targetAddress, amount, address) => {
    try {
        const wsProvider = new WsProvider("wss://rpc.astar.network");
        const api = await ApiPromise.create({ provider: wsProvider });

        const injector = await api.tx.balances
            .transfer(targetAddress, amount)
            .signAndSend(address, (status) => {
                if (status.isInBlock) {
                    console.log(
                        `Completed at block hash #${status.asInBlock.toString()}`
                    );
                } else {
                    console.log(`Current status: ${status.type}`);
                }
            });

        setResult({ success: true, injector });
    } catch (error) {
        console.error("Error transferring funds:", error);
        setResult({ success: false, error: "Internal Server Error" });
    }
};

export function beautifyAddress(address, prefixLength = 4, suffixLength = 4) {
    // Extract prefix and suffix
    const prefix = address.slice(0, prefixLength);
    const suffix = address.slice(-suffixLength);

    // Construct the beautified address
    const beautifiedAddress = `${prefix}...${suffix}`;

    return beautifiedAddress;
}

// export async function transferFunds(targetAddress, amount, address) {
//     try {
//         const response = await axios.post(
//             "https://blend-server.vercel.app/transfer",
//             {
//                 targetAddress,
//                 amount,
//                 address,
//             }
//         );

//         const result = response.data;

//         if (result.success) {
//             console.log("Funds transferred successfully:", result.injector);
//         } else {
//             console.error("Error transferring funds:", result.error);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

export const handleDownload = async (obj) => {
    try {
        const fileName = "image.obj";
        const blob = new Blob([obj], {
            type: "application/octet-stream",
        });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } catch (error) {
        console.error("Error downloading file:", error);
    }
};

export const clearIndexedDB = async () => {
    const dbName = "MyDatabase";

    try {
        // Open a connection to the database
        const db = window.indexedDB.open(dbName);

        // If the connection is successful, delete object stores
        if (db) {
            const objectStoreNames = db.objectStoreNames;

            for (let i = 0; i < objectStoreNames.length; i++) {
                db.deleteObjectStore(objectStoreNames[i]);
            }

            // Close the connection
            db.close();
        }
    } catch (error) {
        console.error("Error clearing indexedDB:", error);
    }
};

export function getObjFromIndexedDB(objFileName, callback) {
    const dbPromise = indexedDB.open("MyDatabase", 1);

    dbPromise.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["objFiles"], "readonly");
        const store = transaction.objectStore("objFiles");
        const request = store.get(objFileName);

        request.onsuccess = function (event) {
            const result = event.target.result;
            if (result) {
                console.log("File retrieved successfully.");
                callback(result.data);
            } else {
                console.error("File not found.");
            }
        };

        request.onerror = function (error) {
            console.error("Error retrieving file:", error);
            callback("Not found");
        };
    };
}

export const uploadImageToS3 = async (imageFile) => {
    try {
        // Use FormData to send the image file
        const formData = new FormData();
        formData.append("image", imageFile);

        // Send a POST request to the server endpoint
        const response = await axios.post(
            "https://blend-server.vercel.app/aws/upload",
            // "http://localhost:3000/aws/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", 
                },
            }
        );

        // Assuming the API returns JSON data
        return response.data;
    } catch (error) {
        console.error("Error uploading and forwarding image:", error);
        return { error: "Error uploading and forwarding image" };
    }
};

export const sendImageToFlask = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await axios.post(
            "https://blend-server.vercel.app/aws/send",
            // "http://localhost:3000/aws/send",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error uploading and forwarding image:", error.message);
    }
};
