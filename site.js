class UI {
  constructor() {
    this.paycheckOutput = document.getElementById('paycheck');
    this.wageInput = document.getElementById('wage');
    this.regularHoursInput = document.getElementById('regular-hours');
    this.timeHalfHoursInput = document.getElementById('time-half-hours');
    this.doubleHoursInput = document.getElementById('double-hours');
  }

  getValueOf(input) {
    if (!(isNaN(+input.value))) return +input.value;
    else return 0.00;
  }

  setPaycheck(value) {
    this.paycheckOutput.textContent = value;
  }

  registerEventListener(fn) {
    this.wageInput.addEventListener('input', fn);
    this.regularHoursInput.addEventListener('input',fn)
    this.timeHalfHoursInput.addEventListener('input', fn);
    this.doubleHoursInput.addEventListener('input', fn);
  }
}

(() => {
  const fedMedRate = 0.0145;
  const fedOasdiRate = 0.062;
  const illinoisRate = 0.0495;
  const federalRate = [
    [146, 0.10, 0.00],
    [519, 0.12, 37.30],
    [1664, 0.22, 174.70],
    [3385, 0.24, 553.32]
  ];
  const sadAlienExtra = 307.70;
  const ui = new UI();
  function calculateGross() {
    let wage = ui.getValueOf(ui.wageInput);
    let gross = wage * ui.getValueOf(ui.regularHoursInput);
    gross += (wage * 1.5) * ui.getValueOf(ui.timeHalfHoursInput);
    gross += (wage * 2) * ui.getValueOf(ui.doubleHoursInput);
    return gross;
  }
  function calculateDeductions(gross) {
    let fedMedWithholding = gross * fedMedRate;
    let fedOasdiWithholding = gross * fedOasdiRate;
    let illinoisWithholding = gross * illinoisRate;
    let federalWithholding = calculateFederalWithholding(gross);
    return fedMedWithholding + fedOasdiWithholding + illinoisWithholding + federalWithholding;
  }

  function calculatePaycheck() {
    let gross = calculateGross();
    if (gross > 0) {
      let paycheck = gross - calculateDeductions(gross);
      return paycheck;
    } else return 0;
  }

  function calculateFederalWithholding(gross) {
    gross += sadAlienExtra;
    let federalWithholding = 0.00;
    let done = false;
    let payGrade = federalRate.length - 1;
    while (!done && payGrade >= 0) {
      if (gross > federalRate[payGrade][0]) {
        federalWithholding = (gross - federalRate[payGrade][0]) * federalRate[payGrade][1] + federalRate[payGrade][2];
        done = true;
      } else payGrade--;
    }
    return federalWithholding;
  }
  ui.registerEventListener(() => {
    console.time('paycheck');
    let paycheck = calculatePaycheck();
    console.timeEnd('paycheck');
    ui.setPaycheck(`\$${paycheck.toFixed(2)}`);
  });
})();


// $.noConflict();
// (function($) {
//   $(document).ready(function() {
//     var wage=0;regularHours=0;timeHalfHours=0;doubleHours=0;
//     var gross=0;fedWith=0;fedMed=0;fedOasdi=0;ilWith=0;sadAlienExtra=307.70;

//     $('input').on('input',function() {
//       calculatePaycheck();
//     });
    
//     function calculatePaycheck() {
//       wage = $('#wage').val();
//       regularHours = $('#regular-hours').val();
//       timeHalfHours = $('#time-half-hours').val();
//       doubleHours = $('#double-hours').val();
//       gross = wage*regularHours + (wage*1.5)*timeHalfHours + (wage*2)*doubleHours;
//       fedMed = gross * 0.0145;
//       fedOasdi = gross * .062;
//       ilWith = gross * .0495;
//       if((gross+sadAlienExtra) > 3385) {
//         fedWith = (gross - 3385 + sadAlienExtra) * .24 + 553.32;
//       } else if((gross+sadAlienExtra) > 1664) {
//         fedWith = (gross - 1664 + sadAlienExtra) * .22 + 174.70;
//       } else if((gross+sadAlienExtra) > 519) {
//         fedWith = (gross - 519 + sadAlienExtra) * .12 + 37.30;
//       } else if ((gross+sadAlienExtra) > 146 ) {
//         fedWith = (gross - 146 + sadAlienExtra) * .10;
//       } 
//       displayTotals();
//     }

//     function displayTotals() {
//       let totalDeductions = fedWith + fedMed + fedOasdi + ilWith;
//       let netpay = gross - totalDeductions;
//       if(netpay > 0) {
//         $('#paycheck').html('$'+netpay.toFixed(2));
//         $('#gross').html('$'+gross.toFixed(2));
//         $('#fed-withholing').html('$'+fedWith.toFixed(2));
//         $('#il-withholding').html('$'+ilWith.toFixed(2));
//         $('#medicare').html('$'+fedMed.toFixed(2));
//         $('#fed-other').html('$'+fedOasdi.toFixed(2));
//         $('#total-deductions').html('$'+totalDeductions.toFixed(2));
//       } else {
//         $('#paycheck').html('$0');
//         $('#gross').html('$0');
//         $('#fed-withholing').html('$0');
//         $('#il-withholding').html('$0');
//         $('#medicare').html('$0');
//         $('#fed-other').html('$0');
//         $('#total-deductions').html('$0');
//       }
//     }
//   });
// })(jQuery);