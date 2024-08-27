const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword, generateToken, verifyToken } = require("../../utils/auth");

jest.mock('bcryptjs', () => ({
    hashSync: jest.fn().mockReturnValue("hashedPassword"),
    compareSync: jest.fn().mockReturnValue(true)
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('token'),
    verify: jest.fn().mockReturnValue({ id: 100, firstName: "John" })
}));

describe('auth unit test', () => {
    describe("hash password function", () => {
        const result = hashPassword('mockedPassword');

        it("bcrypt.hashSync has been called", () => {
            expect(bcrypt.hashSync).toHaveBeenCalledWith('mockedPassword', 12);
        })

        it("check return value of hashPassword method", () => {
            expect(result).toBe("hashedPassword");
        })
    })

    describe('compare password function', () => {
        let result = comparePassword('password', 'hashedPassword')
        it("bcrypt.compareSync has been called", () => {
            expect(bcrypt.compareSync).toHaveBeenCalledWith('password', 'hashedPassword');
        })
        it("check return value of comparePassword when password is matching", () => {
            expect(result).toBe(true);
        })
        it("check return value of comparePassword when password is not matching", () => {
            jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
            let result = comparePassword('password', 'hashedPassword')
            expect(result).toBe(false);
        })
    })
    describe("generate token function", () => {
        let user = { id: 100, firstName: "John" };
        const result = generateToken(user);

        it("jwt.sign has been called", () => {
            expect(jwt.sign).toHaveBeenCalledWith({ user }, process.env.SECRET_KEY);
        })

        it("check return value of generateToken", () => {
            expect(result).toBe("token");
        })
    })

    describe('verify token', () => {
        let user = { id: 100, firstName: "John" };
        jwt.verify.mockImplementation((token, secretKey, callback) => {
            return callback(null, user)
        });

        const result = verifyToken('token');
        it('jwt.verify returning correct value', () => {
            expect(result).toEqual(user);
        })

        it('jwt.verify returning correct value', () => {

            jwt.verify.mockImplementation((token, secretKey, callback) => {
                return callback(true, null);
            });
            const result = verifyToken('token');
            expect(result).toEqual(false);
        })
    })
})