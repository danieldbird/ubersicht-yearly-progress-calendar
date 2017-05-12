command: "",

dayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
offdayIndices: [0, 6], // Fr, Sa
 
refreshFrequency: '1hr',
displayedDate: null,

render: function () {
  return "<div class=\"cal-container\">\
  <div class=\"this-year\"></div>\
  <table class=\"center\">\
  <tr class=\"weekday\"></tr>\
  <tr class=\"midline\"></tr>\
  <tr class=\"date\"></tr>\
  </table>\
  <div class=\"next-year\"></div>\
  </div>\
  <div id=\"year-container\">\
  <div id=\"bar\">\
  <div id=\"indicator\"></div>\
  </div>\
  <div id=\"test\"></div>\
  </div>\
  ";
},
 
style: "                              \n\
  font-family: Helvetica Neue         \n\
  font-size: 12px                     \n\
  font-weight: 500                    \n\
  color: #ddd                         \n\
  width: 100%                         \n\
  bottom: 0px                         \n\
                                      \n\
  .cal-container                      \n\
    width: 100%                       \n\
    background: rgba(#000, .3)        \n\
                                      \n\
  .this-year                          \n\
    color: rgba(#fff, .7)             \n\
    font-size: 35px                   \n\
    position: absolute                \n\
    bottom: 25px                      \n\
    left: 25px                        \n\
    text-transform: uppercase         \n\
                                      \n\
  .next-year                          \n\
    color: rgba(#fff, .7)             \n\
    font-size: 35px                   \n\
    position: absolute                \n\
    bottom: 25px                      \n\
    right: 25px;                      \n\
    text-transform: uppercase         \n\
                                      \n\
  table                               \n\
    border-collapse: collapse         \n\
                                      \n\
  table.center                        \n\
    margin-left:auto                  \n\
    margin-right:auto                 \n\
                                      \n\
  td                                  \n\
    padding-left: 1vw                 \n\
    padding-right: 1vw                \n\
    text-align: center                \n\
                                      \n\
  .weekday td                         \n\
    padding-top: 19px                 \n\
    padding-bottom: 19px              \n\
                                      \n\
  .date td                            \n\
    padding-top: 19px                 \n\
    padding-bottom: 19px              \n\
                                      \n\
  .today, .off-today                  \n\
    background: rgba(#fff, 0.05)      \n\
                                      \n\
  .weekday .today,                    \n\
  .weekday .off-today                 \n\
                                      \n\
  .date .today,                       \n\
  .date .off-today                    \n\
    color: rgba(#fff, 1)              \n\
                                      \n\
  .midline                            \n\
    height: 1px                       \n\
    background: rgba(#fff, .1)        \n\
                                      \n\
  .midline .today                     \n\
    background: rgba(#0bf, .8)        \n\
                                      \n\
  .midline .offday                    \n\
    background: rgba(#fff, 0)         \n\
                                      \n\
  .midline .off-today                 \n\
    background: rgba(#fff, .4)        \n\
                                      \n\
  .offday, .off-today                 \n\
    color: rgba(#fff, .2)             \n\
                                      \n\
  #year-container                 	  \n\
    background: rgba(#000, .3)        \n\
    width: 100%                       \n\
    height: 20px;                    \n\
                                      \n\
  #bar                                \n\
    position: relative                \n\
    top: 0px                         \n\
    width: 1660px                        \n\
    height: 2px                       \n\
    background: rgba(#fff, .1)        \n\
    margin: 0 auto                    \n\
                                      \n\
  #indicator                          \n\
  	position: relative                \n\
  	top: 2px                          \n\
  	height: 0px                      \n\
  	border-right: 2px solid rgba(#fff, .2) \n\
  	text-align: center                \n\
                                      \n\
  #indicator:after                    \n\
  	position: absolute                \n\
  	content: attr(data-content)       \n\
  	left: 100%                        \n\
  	top: -8px                         \n\
  	margin-left: -10px                \n\
  	text-align: center                \n\
",

update: function (output, domEl) {
  
  var date = new Date(), y = date.getFullYear(), m = date.getMonth(), today = date.getDate();
  var start = 1;
  var end = 365;
  var date1 = new Date(m+1+"/"+today+"/"+y);
  var date2 = new Date("1/1/"+(y+1));
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  var daysPast = end-daysLeft;
  var percentageLeft = Math.abs((daysPast/end)*100).toFixed(1);

  var newDate = [today, m, y].join("/");
  if(this.displayedDate != null && this.displayedDate == newDate) return;
  else this.displayedDate = newDate;

  var firstWeekDay = new Date(y, m, 1).getDay();
  var lastDate = new Date(y, m + 1, 0).getDate();
  
  var weekdays = "", midlines = "", dates = "";

  for (var i = 1, w = firstWeekDay; i <= lastDate; i++, w++) {
    w %= 7;
    var isToday = (i == today), isOffday = (this.offdayIndices.indexOf(w) != -1);
    var className = "ordinary";
    if(isToday && isOffday) className = "off-today";
    else if(isToday) className = "today";
    else if(isOffday) className = "offday";

    weekdays += "<td class=\""+className+"\">" + this.dayNames[w] + "</td>";
    midlines += "<td class=\""+className+"\"></td>";
    dates += "<td class=\""+className+"\">" + i + "</td>";
  };

  $(domEl).find(".this-year").html(y);
  $(domEl).find(".weekday").html(weekdays);
  $(domEl).find(".midline").html(midlines);
  $(domEl).find(".date").html(dates);
  $(domEl).find(".next-year").html(y+1);

  document.getElementById("indicator").style.width = percentageLeft+"%";
  var indicator = document.querySelector('#indicator');
  indicator.setAttribute('data-content', percentageLeft+"%");
}


