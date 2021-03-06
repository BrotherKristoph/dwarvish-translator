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

const googleTranslate = require('google-translate')('nope');

function transliterateToDwarvish(hrString) {
    let lowerCase = hrString.toLowerCase();
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
            done(translation.translatedText);
        } else {
            console.err(err);
        }
    });
}

function translateToDwarvish(text, done) {
    translateToHr(text, translatedText => {
        done(transliterateToDwarvish(translatedText));
    });
}

module.exports = {
    translateToDwarvish
};
