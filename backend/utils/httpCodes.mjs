const HTTP_CODES = {
    SUCCESS: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,
    },
    CLIENT_ERROR: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        TOO_MANY_REQUESTS: 429, 
    },
    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: 500,
    },
    RPG_DEFENSE: {
        SHIELD_BLOCK: 418,
    }
};

export default HTTP_CODES;