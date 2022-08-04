
export const en = {
    common: {
      ok: 'Ok',
      cancel: 'Cancel',
      close: 'Close',
      menu: 'Menu',
      save: 'Save',
      search: 'Search',
      edit: 'Edit',
      remove: 'Delete',
      new: 'New',
      yes: 'Yes',
      no: 'No',
      start: 'Start',
      end: 'End',
      notSpecified: 'Not Specified',
      all: 'All',
      one: "One",
      two: "Two",
      three: "Three",
      send: "Send"
    },
    pageNotFound: {
        title: "404 Page not found :("
    },
    menu: {
        home: "Home",
        coveredCals: "Covered calls",
        spreads: "Spreads",
        mostActive: "Most active",
        settings: "Settings",
        signOut: "Sign out",
        signIn: "Sign in",
        signUp: "Sign up",
        admin: "Administration panel"
    },
    settings: {
        title: 'Settings',
        emailTitle: 'Email Adress',
        passwordTitle: 'Change Password',
        email: 'EMail',
        emailNotVerified: 'Awaiting email confirmation',
        sendVerificationEmail: 'Resend verification email',
        verificationEmailSent: 'Verification email sent to specified address'
    },
    feedback: {
        title: "Contact Us",
        email: "Contact Information (email, phone)",
        message: "Message",
        text: "Enter your contact information, write a message and click «Send»",
        sent: "Your message has been sent",
        error: {
            email: 'Enter your contact information',
            message: 'Enter your message',
        }
    },
    app: {
      title: 'Stock options scanner',
      goOfflineMode: 'The program has switched to offline mode',
      goOnlineMode: 'The program has switched to online mode',
    },
    auth: {
        signUp: "Sign up",
        signUpTitle: "Sign up to Option scanner",
        email:'Email Address',
        password:'Password',
        signInStart: "Not a member?",
        signInUrl: "Sign up now",
        signUpStart: "Already a member?",
        signUpUrl: "Sign in",

        signUpCheckStart: "Creating an account means you’re okay with our ",
        signUpCheckTerms: "Terms of Service",
        signUpCheckAnd: " and ",
        signUpCheckPrivacy: "Privacy Policy",

        signUpReadyTitle: "Wecome!",
        signUpReadyP1Start: "We have sent email to",
        signUpReadyP1End: "to confirm the validity of our email address.",
        signUpReadyP2: "After receiving the email follow the link provided to complete your registration.",
        signUpReadyP3Start: "You can start accessing the site",
        signUpReadyP3End: "under your name",

        signInTitle:'Sign in to Option scanner',
        signIn:'Sign in',
        signOut:'Sign out',
        rememberMe: "Remember me",

        resetPasswordText1: "Enter the email address you used when you joined and we’ll send you instructions to reset your password.", 
        resetPasswordText2: "For security reasons, we do NOT store your password. So rest assured that we will never send your password via email.",
        resetPasswordTitle:'Forgot Password?',
        forgotPassword:'forgot password?',
        resetPasswordButton:'Send Reset Instructions',

        resetPasswordSentTitle:'Instructions have been sent ',
        resetPasswordSentP1Start:'We have sent email to',
        resetPasswordSentP1End:'with instructions to reset your password.',
        resetPasswordSentP2:'After receiving the email follow the link provided to complete your password reset.',
        error :{
            register: 'Incorrect registration information',
            emailIncorrect: 'Incorrect email address specified',
            login: 'Incorrect username or password',
            userName: 'username',
            password: 'password',
            currentPassword: 'Incorrect password',
            emailAlreadyExists: 'Specified email already registered',
            loginAlreadyExists: 'username already taken',
            confirmEmailTokenNotPresent: 'No address confirmation token in the request',
            confirmEmailTokenNotFound: 'Address confirmation token not found. Perhaps you have already confirmed your email address, or your registration is out of date.',
            confirmEmailError: 'Verification error',
            resetPasswordError: 'Email not specified',
            resetPasswordTokenNotPresent: 'Request does not contain a token for password reset',
            resetPasswordNotPresent: 'New password not specified',
            resetPasswordTokenNotFound: 'No active password change token found',
            authRequired: 'Authorisation required',
        }

    },
    admin: {
        title: "Administration",
        users: {
            title: "Users",
            disabled: "blocked",
            menu: {
                disable: "block",
                enable: "activate",
                delete: "delete",
            },
        },
        feedback: {
            menu: {
                read: "read",
                unread: "unread",
                delete: "delete",
            },
        },
        error: {
            adminRequired: "Not authorised to create",
            userNameNotFound: "User not found",
        }
    }
}

export default en