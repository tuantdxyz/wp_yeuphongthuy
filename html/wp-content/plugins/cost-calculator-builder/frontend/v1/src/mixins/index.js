export default {
    methods: {
        parseComponentData() {
            if (typeof this.field === 'string' && typeof this.field !== "undefined") {
                this.field = JSON.parse(this.field);
            }

            this.field.required = (typeof this.field.required === 'boolean') ? this.field.required : (this.field.required === 'true' ? true : false) ;
            this.field.hidden   = ( this.field.hidden === true || this.field.hidden === 'true' ) ? true : null;

            return this.field;
        },

        randomID: function () {
            return '_' + Math.random().toString(36).substr(2, 9);
        },

        currencyFormat(amount, element, currencySettings = {}) {


            if (!element.currency)
                return amount;
            try {
                if (Object.keys(currencySettings).length
                    && ( currencySettings.hasOwnProperty('currency') && currencySettings.currency.length > 0 )) {

                    let decimalCount = currencySettings.num_after_integer
                        ? currencySettings.num_after_integer
                        : 2;

                    let decimal = currencySettings.decimal_separator
                        ? currencySettings.decimal_separator
                        : '.';

                    let thousands = currencySettings.thousands_separator
                        ? currencySettings.thousands_separator
                        : ',';

                    decimalCount = Math.abs(decimalCount);
                    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

                    const negativeSign = amount < 0 ? "-" : "";
                    amount = parseFloat(amount);

                    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
                    let j = (i.length > 3) ? i.length % 3 : 0;

                    amount = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");

                    currencySettings.currency = currencySettings.currency
                        ? currencySettings.currency
                        : '';

                    if(currencySettings.currencyPosition === 'left'){
                        amount = currencySettings.currency + amount;
                    }

                    if(currencySettings.currencyPosition === 'right'){
                        amount = amount + currencySettings.currency;
                    }

                    if(currencySettings.currencyPosition === 'left_with_space'){
                        amount = currencySettings.currency + ' ' + amount;
                    }

                    if(currencySettings.currencyPosition === 'right_with_space'){
                        amount = amount + ' ' + currencySettings.currency;
                    }
                }

                return amount;
            } catch (e) {
                console.log(e)
            }
        },

        hexToRgbA(hex, opacity = 1) {
            let c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                c = hex.substring(1).split('');
                if (c.length == 3) {
                    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c = '0x' + c.join('');
                return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
            }

            console.log('Bad Hex');
        },

        hasParentClass(child, classList){
            for (var i = 0; i < classList.length; i ++ ) {
                if( child.className && child.className.split(' ').indexOf(classList[i]) >= 0) {
                    return true;
                }
            }
            //Throws TypeError if no parent
            try{
                return child.parentNode && this.hasParentClass(child.parentNode, classList);
            }catch(TypeError){
                return false;
            }
        },

        isObjectHasPath( object, path ) {
            if (typeof object == 'undefined'){
                return false;
            }
            var propName = path.shift();
            if ( object.hasOwnProperty(propName) ) {
                if ( path.length == 0 ){
                    return true;
                } else {
                    return this.isObjectHasPath(object[propName], path);
                }
            }
            return false;
        },

        simpleObjectCompare( object1, object2 ) {
            const keys1 = Object.keys(object1);
            const keys2 = Object.keys(object2);
            if (keys1.length !== keys2.length) {
                return false;
            }
            for (let key of keys1) {
                if (object1[key] !== object2[key]) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Check is string var contain integer
         * @param {string} possibleIntVar - string with integer value
         * @returns {boolean}
         */
        isPositiveInteger( possibleIntVar ){
            return ((parseInt(possibleIntVar, 10).toString() == possibleIntVar) && possibleIntVar.indexOf('-') === -1);
        }

    },
}