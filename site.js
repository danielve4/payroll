$.noConflict();
(function($) {
  $(document).ready(function() {
    var wage=0;regularHours=0;timeHalfHours=0;doubleHours=0;
    var gross=0;fedWith=0;fedMed=0;fedOasdi=0;ilWith=0;sadAlienExtra=151;

    $('input').on('input',function() {
      calculatePaycheck();
    });
    
    function calculatePaycheck() {
      wage = $('#wage').val();
      regularHours = $('#regular-hours').val();
      timeHalfHours = $('#time-half-hours').val();
      doubleHours = $('#double-hours').val();
      gross = wage*regularHours + (wage*1.5)*timeHalfHours + (wage*2)*doubleHours;
      fedMed = gross * 0.0145;
      fedOasdi = gross * .062;
      ilWith = gross * .0495;
      if(gross > 1658) {
        fedWith = (gross - 1658 + sadAlienExtra) * .24 + 271.08;
      } else if(gross > 815) {
        fedWith = (gross - 815 + sadAlienExtra) * .22 + 85.62;
      } else if(gross > 254) {
        fedWith = (gross - 254 + sadAlienExtra) * .12 + 18.30;
      } else if (gross > 71 ) {
        fedWith = (gross - 71 + sadAlienExtra) * .1;
      } 
      let totalDeductions = fedWith + fedMed + fedOasdi + ilWith;
      let netpay = gross - totalDeductions;
      $('#paycheck').html('$'+netpay.toFixed(2));
      $('#gross').html('$'+gross.toFixed(2));
      $('#fed-withholing').html('$'+fedWith.toFixed(2));
      $('#il-withholding').html('$'+ilWith.toFixed(2));
      $('#medicare').html('$'+fedMed.toFixed(2));
      $('#fed-other').html('$'+fedOasdi.toFixed(2));
      $('#total-deductions').html('$'+totalDeductions.toFixed(2));
    }
  });
})(jQuery);