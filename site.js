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
    this.adjustedFederal = document.getElementById('adjusted-federal');
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
    this.adjustedFederal.addEventListener('click', fn);
  }
}

class Paycheck {
  constructor() {
    this.sadAlienExtra = 307.70;
    this.medicareRate = 0.0145;
    this.fedOasdiRate = 0.062;
    this.illinoisRate = 0.0495;
    this.federalRate = [
      [146, 0.10, 0.00],
      [519, 0.12, 37.30],
      [1664, 0.22, 174.70],
      [3385, 0.24, 553.32]
    ];
    this.wage = 0.00;
    this.regularHours = 0.00;
    this.timeHalfHours = 0.00;
    this.doubleHours = 0.00;
    this.gross = 0.00;
    this.medicareWithholding = 0.00;
    this.fedOasdiWithholding = 0.00;
    this.illinoisWithholding = 0.00;
    this.federalWithholding = 0.00;
    this.totalDeductions = 0.00;
    this.paycheck = 0.00;
    this.adjustedFederal = true;
  }

  calculateGross() {
    if (this.wage > 0) {
      let tempGross = this.wage * this.regularHours;
      tempGross += (this.wage * 1.5) * this.timeHalfHours;
      tempGross += (this.wage * 2) * this.doubleHours;
      return tempGross;
    } else return 0.00;
  }

  calculateDeductions() {
    this.medicareWithholding = this.gross * this.medicareRate;
    this.fedOasdiWithholding = this.gross * this.fedOasdiRate;
    this.illinoisWithholding = this.gross * this.illinoisRate;
    this.federalWithholding = this.calculateFederalWithholding();
    return this.medicareWithholding + this.fedOasdiWithholding + this.illinoisWithholding + this.federalWithholding;
  }

  calculateFederalWithholding() {
    let withholding = 0.00;
    let payGrade = this.federalRate.length;
    let federalGross = this.adjustedFederal ? this.gross + this.sadAlienExtra: this.gross;
    while (payGrade--) {
      if (federalGross > this.federalRate[payGrade][0]) {
        withholding = (federalGross - this.federalRate[payGrade][0]) * this.federalRate[payGrade][1] + this.federalRate[payGrade][2];
        payGrade = 0;
      }
    }
    return withholding;
  }

  calculatePaycheck() {
    this.gross = this.calculateGross();
    if (this.gross > 0.00) {
      this.totalDeductions = this.calculateDeductions();
      this.paycheck = this.gross - this.totalDeductions;
    } else this.paycheck = 0.00;
  }
}

(() => {
  const ui = new UI();
  const paycheck = new Paycheck();
  ui.registerEventListener(() => {
    paycheck.wage = ui.getValueOf(ui.wageInput);
    paycheck.regularHours = ui.getValueOf(ui.regularHoursInput);
    paycheck.timeHalfHours = ui.getValueOf(ui.timeHalfHoursInput);
    paycheck.doubleHours = ui.getValueOf(ui.doubleHoursInput);
    paycheck.adjustedFederal = ui.adjustedFederal.checked;
    paycheck.calculatePaycheck();
    ui.setValueFor(ui.paycheckOutput, paycheck.paycheck);
    ui.setValueFor(ui.gross, paycheck.gross);
    ui.setValueFor(ui.federalWithholding, paycheck.federalWithholding);
    ui.setValueFor(ui.illinoisWithholding, paycheck.illinoisWithholding);
    ui.setValueFor(ui.medicareWithholding, paycheck.medicareWithholding);
    ui.setValueFor(ui.federalOtherWithholding, paycheck.fedOasdiWithholding);
    ui.setValueFor(ui.totalDeductions, paycheck.totalDeductions);
  });
})();
