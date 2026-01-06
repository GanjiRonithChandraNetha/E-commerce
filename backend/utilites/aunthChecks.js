import z from 'zod';

export const loginCheckEmail = z.object({
    email: z.string().email(),
    password:z.string()
    .min(8,"must contain atleast 8 characters")
    .regex(/[A-Z]/,'should have atleast one uppercase letter')
    .regex(/[a-z]/,'should have atleast one lowercase letter')
    .regex(/\d/,'must contain at least one number')
    .regex(/[@$!%?&]/,'must contain at least one special character')
}).strip();

export const  loginCheckMobileNo = z.object({
    password:z.string()
    .min(8,"must contain atleast 8 characters")
    .regex(/[A-Z]/,'should have atleast one uppercase letter')
    .regex(/[a-z]/,'should have atleast one lowercase letter')
    .regex(/\d/,'must contain at least one number')
    .regex(/[@$!%?&]/,'must contain at least one special character'),
    mobileNo: z.string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits")
}).strip();

export const signUpCheck = z.object({
    email: z.string().email(),
    password:z.string()
    .min(8,"must contain atleast 8 characters")
    .regex(/[A-Z]/,'should have atleast one uppercase letter')
    .regex(/[a-z]/,'should have atleast one lowercase letter')
    .regex(/\d/,'must contain at least one number')
    .regex(/[@$!%?&]/,'must contain at least one special character'),
    mobileNo: z.string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    name:z.string()
});

// export default {
//     loginCheckEmail,
//     loginCheckMobileNo,
//     signUpCheck
// }