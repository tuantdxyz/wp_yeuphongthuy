import DateFormatter from "php-date-formatter"

const $ = require('jquery')

export default  {
    props: {
        dateField: {
          type: Object,
          required: true,
          default: {}
        },
    },
    data: () => ({
        calculatorId: 0,
        dayList: [],
        errors: [],
        minDate: null,
        openDate: false,
        selectedDate: {
            'start': null,
            'end': null,
            'range': 0,
            'value':0,
        },
    }),
    computed: {
        calcStore() {
            return this.$store.getters.getCalcStore;
        },
        allElementStyles(){
            var styles = this.$store.getters.getCustomStyles;
            if ( styles.hasOwnProperty('date-picker') ) {
                return styles['date-picker'];
            }
            return {};
        },
        dateFormat() {
            return this.$store.getters.getDateFormat;
        },

        /** .select.date styles **/
        elementStyles() {
            var allStyles = Object.assign({}, this.allElementStyles);
            delete allStyles['width'];
            return allStyles;
        },
        language () {
            return this.$store.getters.getLanguage;
        },
        today () {
            return this.moment().startOf('date');
        },

        translations () {
            return this.$store.getters.getTranslations;
        },

        /** Date as string, to show for user**/
        viewValue() {
            var value = "";

            if ( this.moment.isMoment(this.selectedDate.start) ){

                var fmt = new DateFormatter({
                    dateSettings: {
                        months: this.moment.months(),
                        monthsShort: this.moment.monthsShort(),
                    }
                });

                value   = fmt.formatDate(this.selectedDate.start.toDate(), this.dateFormat);

                if ( parseInt(this.dateField.range) == 1 ){
                    value = value + ' - ';
                    value += ( this.selectedDate.end != null ) ? fmt.formatDate(this.selectedDate.end.toDate(), this.dateFormat) : '';
                }
            }

            return value;
        },

        /** value to send for changes **/
        dateFieldValue: {
            get() {
                return this.selectedDate;
            },
            set( value ) {
                if( !value || ( value.hasOwnProperty('start') && value.hasOwnProperty('end')
                        && value.start == null && value.end == null ) ) {
                    return;
                }

                value.viewValue = this.viewValue;
                value.value     = this.getValue();

                this.$emit("setDatetimeField", value );
            }
        },

    },
    created() {
        /** set calculator id **/
        this.calculatorId = this.$store.getters.getSettings.calc_id || this.$store.getters.getId;

        /** append field styles **/
        this.applyCss();

        /** if field have min_date settings set min possible day  **/
        this.minDate    = this.getMinDate();

        /** set active date to get correct month to appear **/
        this.activeDate = this.moment().startOf('day');
        this.dayList    = this.calendarDays();

        this.selectedDate.range = this.dateField.range;

        /** use wordpress language **/
        this.moment.updateLocale( this.language, {
            week : {
                dow : 1
            }
        });
    },
    watch: {
        activeDate( value ) {
            this.dayList = this.calendarDays();
        },

        /** update styles to show changes **/
        elementStyles: {
            handler: function( value, oldValue ) {
                this.applyCss();
            },
            deep: true
        },

        openDate( isOpened ) {
            this.errors = [];

            if ( isOpened == true ) {
                document.addEventListener('click', this.closeCustomSelect, true);
            }else{
                document.removeEventListener('click', this.closeCustomSelect, true);
            }

            /** show confirmation for with range field if no end date**/
          if ( !isOpened && parseInt(this.dateField.range) == 1 &&
              ( this.selectedDate.start !== null && this.selectedDate.end == null) ) {
              this.errors.push( this.translations.empty_end_date_error );
          }
        },

        /** set value from store **/
        calcStore: {
            handler: function( value ) {

                if (value.hasOwnProperty( this.dateField.alias ) && value[this.dateField.alias].converted == this.selectedDate.viewValue ) {
                    if ( value[this.dateField.alias].converted.length > 0 ) {
                        var dates = this.parseConvertedValueToDates(value[this.dateField.alias].converted);
                        this.selectedDate.start = dates.start;
                        this.selectedDate.end   = dates.end;
                    }
                    return;
                }

                if ( value.hasOwnProperty( this.dateField.alias ) && value[this.dateField.alias].converted.length > 0 ) {
                    /** if changed value by condition **/
                    var dates = this.parseConvertedValueToDates(value[this.dateField.alias].converted);
                    this.selectedDate.start = dates.start;
                    this.selectedDate.end   = dates.end;

                } else if (value.hasOwnProperty( this.dateField.alias ) && value[this.dateField.alias].value == 0 ) {
                    this.selectedDate.start = null;
                    this.selectedDate.end   = null;
                }

                this.dateFieldValue = this.selectedDate;

            },
            deep: true
        },
    },
    methods: {
        applyCss() {
            let style   = '';
            var wrapper = `.calculator-settings.ccb-wrapper-${this.calculatorId}`;

            /**  BORDER SETTINGS, FONT SETTINGS and MARGIN/PADDING is setted to element style **/

            /** set WIDTH **/
            if ( this.allElementStyles.hasOwnProperty('width')){
                style += `body ${wrapper} .ccb-datetime div.date { width: ${this.allElementStyles.width}; } `;
                // style += `body ${wrapper} .ccb-datetime .calendar-select { width: ${this.elementStyles.width}; } `;
            }

            /** set COLOR SETTINGS **/

            /** calendar background **/
            if ( this.allElementStyles.hasOwnProperty('calendar_bg_color') ) {
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select { background-color: ${this.allElementStyles.calendar_bg_color}; }`;
            }

            if ( this.allElementStyles.hasOwnProperty('main_color')){
                style += `body ${wrapper} .ccb-datetime div .select i { color: ${this.allElementStyles.main_color}; } `;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .month-slide-control div { background-color: ${this.allElementStyles.main_color}; } `;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day { color: ${this.allElementStyles.main_color}; } `;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day.today { border: 1px solid ${this.allElementStyles.main_color}; }`;

                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .month-slide-control div.next:hover{ color: ${this.allElementStyles.main_color}; } `;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .month-slide-control div.prev:hover { color: ${this.allElementStyles.main_color}; } `;
            }

            if ( this.allElementStyles.hasOwnProperty('highlight_color') ) {
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .month-slide-control div.next:hover{ background-color: ${this.allElementStyles.highlight_color}; }`;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .month-slide-control div.prev:hover { background-color: ${this.allElementStyles.highlight_color}; }`;

                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day:not(.day-off, .inactive):hover { border: 1px solid ${this.allElementStyles.highlight_color};  color:${this.allElementStyles.highlight_color} }`;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day:focus { border: 1px solid ${this.allElementStyles.highlight_color};  color:${this.allElementStyles.highlight_color} }`;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day.selected { border: 1px solid ${this.allElementStyles.highlight_color}; color:${this.allElementStyles.highlight_color} }`;
            }

            if ( this.allElementStyles.hasOwnProperty('highlight_bg_color') ) {
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day.today { background-color: ${this.allElementStyles.highlight_bg_color}; }`;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day:not(.day-off, .inactive):hover { background-color: ${this.allElementStyles.highlight_bg_color}; }`;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day:focus { background-color: ${this.allElementStyles.highlight_bg_color}; }`;
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day.selected { background-color: ${this.allElementStyles.highlight_bg_color}; }`;
            }

            if ( this.allElementStyles.hasOwnProperty('day_bg_color') ) {
                style += `body ${wrapper} .ccb-datetime div.date .calendar-select .day-list .week .day { background-color: ${this.allElementStyles.day_bg_color}; }`;
            }

            var selector = $('#ccb-datepicker-style-' + this.calculatorId);
            if (selector.length) selector.remove();

            $('head').append(`<style type="text/css" id="ccb-datepicker-style-${this.calculatorId}">${style}</style>`);
        },

        /** month day list, separated by weeks */
        calendarDays() {
            let startDate = this.activeDate.clone().startOf('month');
            let endDate   = this.activeDate.clone().endOf('month');
            var firstWeek = startDate.clone().startOf('week');
            var lastWeek  = endDate.clone().endOf('week');
            let daysArray = [], tempItem;

            while ( firstWeek.isSameOrBefore(lastWeek) ) {
                let weekArray = [];
                for ( let i = 0; i < 7; i++ ) {
                    let item = firstWeek.clone().startOf('week');
                    item.set('date', item.date() + i).startOf('date');
                    tempItem = {
                        date: item,
                        currentMonth: ( this.activeDate.month() == item.month() ),
                    };
                    weekArray.push( tempItem );
                }
                daysArray.push( weekArray );
                firstWeek.add(1, 'week');
            }
            return daysArray;
        },

        cleanDate(){
          this.selectedDate.start     = null;
          this.selectedDate.end       = null;
          this.selectedDate.viewValue = '';
          this.selectedDate.value     = 0;

          this.errors = [];
          this.$emit("setDatetimeField", this.selectedDate );
        },

        /** event listener to close custom date-field **/
        closeCustomSelect(e) {
            if ( e.target.closest('.ccb-datetime') !== null && !e.target.closest('.ccb-datetime').classList.contains(this.dateField.alias) ) {
                this.openDate = false;
            }
            if ( e.target.classList.contains('select') || e.target.classList.contains('select')
                || this.hasParentClass(e.target, ['select', 'calendar-select', 'time-select'])) {
                return;
            }
            this.openDate = false;
        },

        /** set correct class for day element in calendar **/
        getDateClass( dayDate ) {
            var dayDivCls = ['active'];
            if ( this.isEqualDate(this.activeDate, dayDate.date)
                && ( this.minDate == null || (this.minDate != null && this.minDate.isAfter(dayDate.date)) ) ) {
                dayDivCls.push('active');
            }

            if ( this.isEqualDate(this.today, dayDate.date) ) {
                dayDivCls.push('today');
            }

            if ( this.selectedDate.start !=null && this.isEqualDate(dayDate.date, this.selectedDate.start)) {
                dayDivCls.push('selected');
            }

            if ( ( this.selectedDate.end !=null && this.selectedDate.start !=null )
                && dayDate.date.isBetween(this.selectedDate.start, this.selectedDate.end, null, '[]') ) {
                dayDivCls.push('selected');
            }

            if ( !dayDate.currentMonth ) {
                dayDivCls.push('not-current-month');
            }

            if ( ( this.minDate !== null && this.minDate.isAfter(dayDate.date) )) {
                dayDivCls.push('inactive');
            }
            return dayDivCls.join(' ');
        },

        /** if field have min_date settings set min possible day  **/
        getMinDate(){
            if ( this.dateField.hasOwnProperty('min_date') && this.dateField.min_date ) {

                if ( this.dateField.hasOwnProperty('min_date_days') && parseInt(this.dateField.min_date_days) > 0 ) {
                    return this.moment().startOf('date').set('date', this.moment().startOf('date').date() + parseInt(this.dateField.min_date_days));
                }else{
                    return this.moment().startOf('date');
                }
            }
            return null;
        },

        /** days count, used as value **/
        getValue(){
            var days = 0;

            /** always 1 for no range date field **/
            if ( parseInt(this.dateField.range) == 0 && this.selectedDate.hasOwnProperty('start')
                && this.selectedDate.start != null){
                days = 1;
            }

            /** count days between days for 'with range' date field **/
            if ( parseInt(this.dateField.range) == 1 ) {
                days = 1;
                if ( this.selectedDate.hasOwnProperty('start') && ( this.selectedDate.hasOwnProperty('end') && this.selectedDate.end != null ) ) {
                    /** clone and set end of date to include past day **/
                    days = this.selectedDate.end.clone().endOf('date').diff( this.selectedDate.start, 'days', true );
                    days = Math.round(days);
                }
            }
            return days;
        },

        /** compare dates **/
        isEqualDate(date1, date2) {
            return ( date1 && date2 && date1.format('D-M-Y') === date2.format('D-M-Y') );
        },

        parseConvertedValueToDates( converted ) {
            var datesArray = converted.split (" - ").map(item=>item.trim());

            var fmt = new DateFormatter();

            var start = fmt.parseDate(datesArray[0], this.dateFormat);
            var startDay   = (start.getDate() < 10 ? '0' : '') + start.getDate();
            var startMonth = ((start.getMonth() + 1) < 10 ? '0' : '') + (start.getMonth() + 1);

            if ( datesArray[1] ) {
                var end   = fmt.parseDate(datesArray[1], this.dateFormat);
                var endDay   = (end.getDate() < 10 ? '0' : '') + end.getDate();
                var endMonth = ((end.getMonth() + 1) < 10 ? '0' : '') + (end.getMonth() + 1);
            }

            return {
                'start': datesArray[0] ? this.moment([startDay, startMonth, start.getFullYear()].join('/'), 'DD/MM/YYYY', true) : null,
                'end': datesArray[1] ? this.moment([endDay, endMonth, start.getFullYear()].join('/'), 'DD/MM/YYYY', true) : null
            };
        },

        selectDate( selectedDate ) {
            if ( this.minDate !== null && this.minDate.isAfter(selectedDate) ) {
                return;
            }

            /** with range; set end and start values logic **/
            if ( parseInt(this.dateField.range) == 1 ){
                if ( ( this.selectedDate.end != null && this.selectedDate.start != null ) || this.selectedDate.start == null
                    || ( this.selectedDate.start != null && this.selectedDate.start.isAfter(selectedDate) ) ){

                    this.selectedDate.start = selectedDate.startOf('date');
                    this.selectedDate.end   = null;

                }else if ( this.selectedDate.start != null ){
                    this.selectedDate.end   = selectedDate;
                }else{
                    this.selectedDate.start = selectedDate.startOf('date');
                }
            }

            /** no range **/
            if ( parseInt(this.dateField.range) == 0 ){
                this.selectedDate.start = selectedDate.startOf('date');
            }

            this.errors = [];
            this.dateFieldValue = this.selectedDate;
        },

        slideMonth( next ) {
            var currentDate = this.activeDate.clone();
            let newDate     = ( next ) ? currentDate.add(1, 'month'): currentDate.subtract(1, 'month');
            newDate.startOf('month');
            if ( this.moment().startOf('date').month() == newDate.month() ){
                newDate.set('date', this.moment().startOf('date').date());
            }

            this.activeDate   = newDate;
            this.dayList      = this.calendarDays();

            setTimeout( () => {
                this.updateTopPosition();
            })
        },

        /** week day list **/
        weekdays() {
            let weekdays = this.moment.weekdaysShort();
            weekdays.push(weekdays.shift());
            return weekdays;
        },

        showCalendar() {
            this.updateTopPosition();
            this.openDate = !this.openDate;
        },

        updateTopPosition(){
            var defaultCalendarHeight = 240;
            var fieldObj    = this.$parent.$el.getElementsByClassName(this.dateField.alias + '_datetime')[0];
            var calendarObj = this.$el.getElementsByClassName('calendar-select')[0];

            var diffFromBtm = document.getElementsByClassName('ccb-wrapper-'+ this.calculatorId)[0]
                .getBoundingClientRect().bottom - fieldObj.getBoundingClientRect().bottom;

            var topPosition = fieldObj.getBoundingClientRect().bottom - fieldObj.getBoundingClientRect().top;
            if ( diffFromBtm < defaultCalendarHeight ) {
                topPosition = calendarObj.scrollHeight * -1;
            }
            calendarObj.style.top      = [topPosition, 'px'].join('');
        }
    },
    template: `
      <div :class="['ccb-datetime', 'datetime', dateField.alias, dateField.alias + '_datetime']">
        <div class="date" >
          <span :style="elementStyles" :class="['select date', {'open': openDate}, {'error': ( errors.length > 0 || $store.getters.isUnused(dateField) ) }]">
                <span v-if="selectedDate.start" @click.prevent="showCalendar()">{{ viewValue }}</span>
                <span v-else-if="dateField.placeholder" @click.prevent="showCalendar()">{{ dateField.placeholder }}</span>
                <span v-else-if="dateField.range == 1" @click.prevent="showCalendar()">{{ translations.select_date_range }}</span>
                <span v-else @click.prevent="showCalendar()">{{ translations.select_date }}</span>
                
                <i v-if="selectedDate.start" class="fa fa-times" @click="cleanDate"></i>
                <i v-else class="fa fa-calendar" @click.prevent="showCalendar()"></i>
          </span>
          <span class="error-tip" v-if="errors.length > 0">{{ errors.join('') }}</span>
          
          <div  :class="['calendar-select', {'hidden': !openDate}]">
            <div class="month-slide-control">
              <div class="prev" @click.prevent="slideMonth(false)">
                <i class="fa fa-arrow-left"></i>
              </div>
              <div class="slider-title">{{ activeDate.format('MMMM YYYY') }}</div>
              <div class="next" @click.prevent="slideMonth(true)">
                <i class="fa fa-arrow-right"></i>
              </div>
            </div>
            <div class="day-list">
              <div class="week-titles">
                <div class="title" v-for="(weekTitle, weekDayIndex) in weekdays()" :key="weekDayIndex">
                    {{ weekTitle }}
                </div>
              </div>
              <div v-for="(week, weekIndex) in dayList" class="week">
                <div v-for="day in week" :key="day.date.dayOfYear()" @click="selectDate( day.date )" :class="['day', getDateClass( day ) ]">
                  {{ day.date.date() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
}