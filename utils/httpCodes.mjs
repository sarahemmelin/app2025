import { setUncaughtExceptionCaptureCallback } from "node:process"

const HTTP_CODES = {

    SUCCESS: {
        OK: 200,
        // OK: { min: 200, max: 299 } Dette fungerer ikke fordi den kun tar numeriske verdier og ikke objekter.
    },
    CLIENT_ERROR: {
        NOT_FOUND: 404
    }
    
}

export default HTTP_CODES;