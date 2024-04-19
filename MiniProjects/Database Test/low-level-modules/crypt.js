/**
 * @module crypt
 * @description Provide functions to create hashed passwords (createHash) from a password and a salt (provided by createSalt) and to verify user authentication (verifyStoredPassword).
 * @exports {createSalt, createHash, verifyStoredPassword} moduleExports - The names are self explained.
 */
const bcrypt = require('../bcryptjs');
module.exports = {createSalt, createHash, verifyStoredPassword};

/**
 * @description Create salt to hash passwords.
 * @param {Number} costFactor - Number of rounds to use.
 * @returns {String} String containing the generated salt.
 */
async function createSalt(costFactor = 10) { // TESTED OK
    try {
      const salt = await bcrypt.genSalt(costFactor);
      return salt;
    } catch (error) {
      console.error("Salting Error:", error);
      throw error;
    }
  }
  
  /**
 * @description Hash a password with salt either passed as an argument or generated by the function.
 * @param {String} password - User's password.
 * @param {String} salt - Salt to season the password, is facultative.
 * @returns {[String, String]} Salted password and its salt.
 */
  async function createHash(password, salt = undefined) { // TESTED OK
    try {
      const finalSalt = salt ?? await createSalt(); 
      const hash = await bcrypt.hash(password, finalSalt);
      return [hash, finalSalt];
    } catch (error) {
      console.error("Hashing Error:", error);
      throw error; // Re-throw the error for proper handling
    }
  }

/**
 * @description Verify if two hashed passwords are identical. 
 * @param {String} enteredPassword - User's password, password to check.
 * @param {String} storedPassword - Stored password, the reference usually from the database.
 * @returns {Boolean} Returns true if the password to check and the stored password corresponds, false otherwise.
 */
async function verifyStoredPassword(enteredPassword, storedPassword) {
    return await bcrypt.compare(enteredPassword, storedPassword);
}


// Based on a first chat with a given LLM, I asked it to give me a library for generating salt and hash; it advised me to use bcrypt, zxcvbn or argon2. 
// I challenged him after looking into popular JS library, I found that Stanford JavaScript Crypto Library was more popular on Github 
// and I asked him why he didn't advise me this one. It said there has been security vulnerabilities in the past. I didn't want to double check
// that info about SJCL so I decided to go and check from well known "security" authorities in software development and I found that the LLM was quite right about
// about using Argon2 or bcrypt (in that order preferentially, but also mentionned use of scrypt, PBKDF2; all these alternatives depends on system requirements and are valid options)
// There are a lot of best practices but I won't go over all of them for this project, but I know where I can find my references and that LLM chats can sometime provide good information quickly.