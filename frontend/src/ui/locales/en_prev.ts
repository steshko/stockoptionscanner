
export const en = {
    common: {
      ok: 'Ok',
      cancel: 'Отмена',
      close: 'Закрыть',
      menu: 'Меню',
      save: 'Сохранить',
      search: 'Искать',
      edit: 'Изменить',
      remove: 'Удалить',
      new: 'Новый',
      yes: 'Да',
      no: 'Нет',
      start: 'Старт',
      end: 'Конец',
      notSpecified: 'Не указано',
      all: 'Все',
      one: "Один",
      two: "Два",
      three: "Три",
      send: "Отправить"
    },
    pageNotFound: {
        title: "404 Page not found :("
    },
    menu: {
        home: "Home",
        coveredCals: "Covered cals",
        spreads: "Spreads",
        mostActive: "Most active",
        settings: "Settings",
        signOut: "Sign out",
        signIn: "Sign in",
        signUp: "Sign up"
    },
    settings: {
        title: 'Настройки',
        emailTitle: 'Электронная почта',
        passwordTitle: 'Изменить пароль',
        email: 'EMail',
        emailNotVerified: 'Мы ожидаем подтверждения адреса электронной почты',
        sendVerificationEmail: 'Отправить повторное сообщение',
        verificationEmailSent: 'Инструкции для подтверждения адреса отправленны по адресу'
    },
    feedback: {
        title: "Обратная связь",
        email: "Контактные данные (email, телефон)",
        message: "Сообщение",
        text: "Укажите контактные данные, напишите сообщение и нажмите «Отправить»",
        sent: "Ваше сообщение отправлено",
        error: {
            email: 'Укажите контактные данные',
            message: 'Укажите текст сообщения',
        }
    },
    app: {
      title: 'Stock options scanner',
      goOfflineMode: 'Приложение перешло в офлайн режим',
      goOnlineMode: 'Приложение перешло в онлайн режим',
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
        resetPasswordSentP1End:'with instructions to reset our password.',
        resetPasswordSentP2:'After receiving the email follow the link provided to complete your registration.',
        error :{
            register: 'Не корректная регистрационная информация',
            emailIncorrect: 'Указан не корректный адрес электронной почты',
            login: 'Не правильный пароль или имя пользователя',
            userName: 'Укажите имя пользователя',
            password: 'Укажите пароль',
            currentPassword: 'Не правильный текущий пароль',
            emailAlreadyExists: 'Указанный email используется другим пользователем',
            loginAlreadyExists: 'Указанное имя используется другим пользователем',
            confirmEmailTokenNotPresent: 'В запросе нет токена подтверждения адреса',
            confirmEmailTokenNotFound: 'Не найден токен подтверждения адреса. Возможно вы уже подтведили свой адресс электронной почты, или ваша регистрация устарела.',
            confirmEmailError: 'Ошибка подтверждения',
            resetPasswordError: 'Не указан адрес электронной почты',
            resetPasswordTokenNotPresent: 'В запросе нет токена для изменения пароля',
            resetPasswordNotPresent: 'Не указан новый пароль',
            resetPasswordTokenNotFound: 'Не найден активный токен изменения пароля',
            authRequired: 'Требуется авторизация',
        }

    },
    admin: {
        title: "Администрирование",
        users: {
            title: "Пользователи",
            disabled: "заблокирован",
            menu: {
                disable: "Заблокировать",
                enable: "Активировать",
                delete: "Удалить",
            },
        },
        feedback: {
            menu: {
                read: "Прочтено",
                unread: "Не прочтено",
                delete: "Удалить",
            },
        },
        error: {
            adminRequired: "Нет прав на создание",
            userNameNotFound: "Пользователь не найден",
        }
    }
    

}

export default en