import React from 'react'
import en from './locales/en'
import _get from 'lodash/get'


let currentLanguageCode: string | null = null;
let defaultLanguageCode = 'en'

export const notFound: string[] = []

const languages = {
    en: {
      id: 'en',
      label: 'English',
      flag: null,
    //   flag: '/images/flags/24/Russia.png',
      dictionary: en,
    },
  }

export function setLanguageCode(arg: string) {
    //    if (!languages[arg]) {
    if ( !_get(languages, arg) ){
        throw new Error(`Invalid language ${arg}.`);
    }
  
    localStorage.setItem('language', arg)
    currentLanguageCode = arg
}

function init() {
    let savedLanguageCode = localStorage.getItem('language')
    if (savedLanguageCode && !_get(languages, savedLanguageCode)) {
        currentLanguageCode = defaultLanguageCode
    } else {
        currentLanguageCode = savedLanguageCode || defaultLanguageCode
    }
    setLanguageCode(currentLanguageCode);
}

export function getLanguageCode() {
    if (!currentLanguageCode) {
        init();
    }
    return currentLanguageCode || defaultLanguageCode
}    

export function getLanguage() {
    return _get(languages, getLanguageCode())
    
    // return languages[getLanguageCode()]
    // switch (getLanguageCode())  {
    //     case 'ru': return languages.ru
    //     case 'en': return languages.en
    //     default: return languages.ru
    // }
}

export function getLanguages() {
    return Object.keys(languages).map((language) => {
      return _get(languages, language) //languages[language];
    });
  }
    
export function locale(key: string | null | undefined): string {
    if (key) {
        const message = _get(getLanguage().dictionary, key)
        if (!message && key) notFound.push(key)
        return message ? message : key
    } else return ''
}

export function changeLanguage(language: string)  {
    setLanguageCode(language);

    window.location.reload();
}

export function FlagsLanguages() {
    return (
        <>
            {getLanguages().map((language) => (
            <img
                key={language.id}
                alt={language.label}
                title={language.label}
                src={language.flag}
                onClick={() => changeLanguage(language.id)
            }
          />
        ))}
        </>
    )
}