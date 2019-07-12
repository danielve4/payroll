class UI {
  constructor() {
    this.paycheckOutput = document.getElementById('paycheck');
    this.wageInput = document.getElementById('wage');
    this.regularHoursInput = document.getElementById('regular-hours');
    this.timeHalfHoursInput = document.getElementById('time-half-hours');
    this.doubleHoursInput = document.getElementById('double-hours');
    this.gross = document.getElementById('gross');
    this.federalWithholding = document.getElementById('fed-withholing');
    this.illinoisWithholding = document.getElementById('il-withholding');
    this.medicareWithholding = document.getElementById('medicare-withholing');
    this.federalOtherWithholding = document.getElementById('fed-other-withholing');
    this.totalDeductions = document.getElementById('total-deductions');
  }

  getValueOf(input) {
    if (!(isNaN(+input.value))) return +input.value;
    else return 0.00;
  }

  setValueFor(attribute, value) {
    attribute.textContent = `\$${value.toFixed(2)}`;
  }

  registerEventListener(fn) {
    this.wageInput.addEventListener('input', fn);
    this.regularHoursInput.addEventListener('input', fn)
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
    if (wage > 0) {
      let gross = wage * ui.getValueOf(ui.regularHoursInput);
      gross += (wage * 1.5) * ui.getValueOf(ui.timeHalfHoursInput);
      gross += (wage * 2) * ui.getValueOf(ui.doubleHoursInput);
      return gross;
    } else return 0.00;
  }
  function calculateDeductions(gross) {
    const fedMedWithholding = gross * fedMedRate;
    const fedOasdiWithholding = gross * fedOasdiRate;
    const illinoisWithholding = gross * illinoisRate;
    const federalWithholding = calculateFederalWithholding(gross);
    const totalDeductions = fedMedWithholding + fedOasdiWithholding + illinoisWithholding + federalWithholding;
    ui.setValueFor(ui.medicareWithholding, fedMedWithholding);
    ui.setValueFor(ui.federalOtherWithholding, fedOasdiWithholding);
    ui.setValueFor(ui.illinoisWithholding, illinoisWithholding);
    ui.setValueFor(ui.federalWithholding, federalWithholding);
    ui.setValueFor(ui.totalDeductions, totalDeductions);
    return totalDeductions;
  }

  function calculatePaycheck() {
    let gross = calculateGross();
    ui.setValueFor(ui.gross, gross);
    if (gross > 0) {
      let paycheck = gross - calculateDeductions(gross);
      return paycheck;
    } else return 0;
  }

  function calculateFederalWithholding(gross) {
    gross += sadAlienExtra;
    let federalWithholding = 0.00;
    let payGrade = federalRate.length;
    while (payGrade--) {
      if (gross > federalRate[payGrade][0]) {
        federalWithholding = (gross - federalRate[payGrade][0]) * federalRate[payGrade][1] + federalRate[payGrade][2];
        payGrade = 0;
      }
    }
    return federalWithholding;
  }
  ui.registerEventListener(() => {
    ui.setValueFor(ui.paycheckOutput, calculatePaycheck());
  });
})();
