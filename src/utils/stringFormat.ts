function processPhoneNumber(input: string) {
    try {
        const reversedPhoneNumber = input.split("").reverse().join("");
        const phoneNumberDigits = parseInt(reversedPhoneNumber, 10).toString().slice(0, 9);
        if (phoneNumberDigits.length !== 9) {
            throw new Error("Invalid phone number format");
        }
        const formattedPhoneNumber = "+255" + phoneNumberDigits.split("").reverse().join("");
        return formattedPhoneNumber;
    } catch (error: any) {
        console.error("Error processing phone number:", error.message);
        return "";
    }
}

export {
    processPhoneNumber
}