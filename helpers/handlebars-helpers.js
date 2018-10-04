const moment = require('moment');

module.exports = {

    select: function(selected, options){
        //Regular Expresions = RexExp
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
        // console.log(param1);
    },

    generateTime: function(date, format){

        return moment(date).format(format);

    }
};