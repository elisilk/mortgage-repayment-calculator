import { defineStore } from 'pinia'

export const useMortgageCalculatorStore = defineStore('mortgageCalculator', {
  state: () => ({
    /** @type { number } */
    amount: null,
    /** @type { number } */
    term: null,
    /** @type { number } */
    rate: null,
    /** @type {'repayment' | 'interest-only'} */
    type: null,
    /** @type {'in-progress' | 'invalid' | 'complete'} */
    status: 'in-progress',
  }),
  getters: {
    isComplete(state) {
      return state.amount && state.term && state.rate && state.type
    },
    monthlyRepayment(state) {
      /* Monthly interest rate (as a decimal) */
      const i = state.rate / 100 / 12
      /* Term in months  */
      const n = state.term * 12
      if (this.type === 'repayment') {
        return (state.amount * i * (1 + i) ** n) / ((1 + i) ** n - 1)
      } else {
        return state.amount * i
      }
    },
    /** @returns { number } */
    totalRepayment() {
      return this.monthlyRepayment * this.term * 12
    },
  },
  actions: {},
})
