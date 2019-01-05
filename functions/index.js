const functions = require('firebase-functions');
const googleTranslate = require('google-translate')(functions.config().cloudtranslation.key);

const hrToDr = {
    'a': 'ᚨ',
    'b': 'ᛒ',
    'c': 'ᛏᛊ',
    'č': 'ᚲᚺ',
    'ć': 'ᚲᚺ',
    'd': 'ᛞ',
    'đ': 'ᛞᛉ',
    'e': 'ᛖ',
    'f': 'ᚠ',
    'g': 'ᚷ',
    'h': 'ᚺ',
    'i': 'ᛁ',
    'j': 'ᛃ',
    'k': 'ᚲ',
    'l': 'ᛚ',
    'm': 'ᛗ',
    'n': 'ᚾ',
    'nj': 'ᛜ',
    'o': 'ᛟ',
    'p': 'ᛈ',
    'r': 'ᚱ',
    's': 'ᛊ',
    'š': 'ᛊᚺ',
    't': 'ᛏ',
    'th': 'ᚦ',
    'u': 'ᚢ',
    'v': 'ᚹ',
    'w': 'ᚹ',
    'x': 'ᚲᛊ',
    'y': 'ᛇ',
    'z': 'ᛉ',
    'ž': 'ᛉᚺ'
};

function transliterateToDwarvish(hrString) {
    if (!hrString) {
        return null;
    }
    const lowerCase = hrString.toLowerCase();
    let drString = '',
        i = 0,
        hrChar,
        drChar;
    
    while (lowerCase && i < lowerCase.length) {
        hrChar = lowerCase.charAt(i);
        if (i + 1 < lowerCase.length) {
            if( hrChar === 'n' &&
                lowerCase.charAt(i + 1) === 'j') {
                hrChar = 'nj';
                i++;
            } else if (hrChar === 't' &&
                lowerCase.charAt(i + 1) === 'h') {
                hrChar = 'th';
                i++;
            }
        }
        i++;
        
        drChar = hrToDr[hrChar];

        if (!drChar) {
            drChar = hrChar;
        }

        drString += drChar;
    }

    return drString;
}

function translateToHr(text, done) {
    googleTranslate.translate(text, 'hr', (err, translation) => {
        if (translation) {
            done(translation.translatedText, null);
        } else {
            console.err(err);
            done(null, err);
        }
    });
}

function translateToDwarvish(text, done) {
    translateToHr(text, (translatedText, err) => {
        done(transliterateToDwarvish(translatedText), err);
    });
}

exports.translateToDwarvish = functions.https.onCall((data, context) => {
    const text = data.text;
    let done = false;
    const start = Date.now();
    let now = Date.now();
    let translation, error;

    translateToDwarvish(text, (translatedText, err) => {
        translation = translatedText;
        error = err;
        done = true;
    })

    while(!done && now - start <= 60000) {
        now = Date.now();
    }

    return {
        translation,
        error
    };
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
