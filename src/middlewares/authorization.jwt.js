import { expressjwt } from "express-jwt";

const guardAuthJWT = expressjwt({
    secret: process.env.JWT_TOKEN_SECRET,
    issuer: process.env.BASE_URL,
    algorithms: ['HS256'],
    getToken: req => {
        let access_token = req.headers.authorization.replace('Bearer ','')
        return access_token
    },
    isRevoked: async (req, token) => {
        // Si le token n'est plus bon : on fait quoi?
    }
});

const guardRefreshToken = expressjwt({
    secret: process.env.JWT_REFRESH_SECRET,
    issuer: process.env.BASE_URL,
    algorithms: ['HS256'],
    requestProperty: "refresh_token",
    getToken: req => {
        return req.body.refresh_token
    }
})

export { guardAuthJWT, guardRefreshToken }