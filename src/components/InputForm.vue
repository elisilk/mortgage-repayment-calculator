<script setup>
import { ref, computed, useTemplateRef } from 'vue'
import { useMortgageCalculatorStore } from '@/stores/mortgageCalculator'

const calculator = useMortgageCalculatorStore()

const inputAmount = useTemplateRef('input-amount')

const form = {
  amount: ref(''),
  term: ref(''),
  rate: ref(''),
  type: ref(''),
}

const errors = ref({})

const isNumberInputValid = (field) =>
  form[field].value !== '' && !Number.isNaN(parseFloat(form[field].value))

function validityErrors(input) {
  if (input.validity.valid) return null

  const validityErrors = []
  for (var key in input.validity) {
    if (input.validity[key]) validityErrors.push(key)
  }
  return validityErrors
}

const isAmountValid = computed(() => {
  console.log('Is amount input valid?', inputAmount.value.validity.valid)
  // console.table(inputAmount.value.validity)

  const errors = validityErrors(inputAmount.value)
  console.log(errors)

  return isNumberInputValid('amount')
})

const isTermValid = computed(
  () => form.term.value !== '' && !Number.isNaN(parseFloat(form.term.value)),
)

const isRateValid = computed(
  () => form.rate.value !== '' && !Number.isNaN(parseFloat(form.rate.value)),
)

const isTypeValid = computed(() => form.type.value !== '')

const validateField = (field) => {
  // Clear any previous error for the field
  delete errors.value[field]

  console.log('validating field:', field)

  if (field === 'amount' && !isAmountValid.value) {
    if (form[field].value === '') {
      errors.value.amount = 'Amount field is required.'
    } else if (Number.isNaN(parseFloat(form[field].value))) {
      errors.value.amount = 'Amount must be number.'
    } else {
      errors.value.amount = 'This field is required.'
    }
  }
  if (field === 'amount' && isAmountValid.value) {
    console.log(form.amount.value)
    // form.amount.value = new Intl.NumberFormat('en-GB', {
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 2,
    // }).format(form.amount.value.toString().replace(/,/g, ''))
    // parseFloat(form.amount.value).toLocaleString('en-GB')
  }

  if (field === 'term' && !isTermValid.value) {
    errors.value.term = 'Term field is required.'
  }

  if (field === 'rate' && !isRateValid.value) {
    errors.value.rate = 'Rate field is required.'
  }

  if (field === 'type' && !isTypeValid.value) {
    errors.value.type = 'This field is required.'
  }
  // Add more validation checks for other form fields as needed
}

function getImageUrl(url) {
  return new URL(`../assets/images/${url}`, import.meta.url).href
}

function handleSubmit(event) {
  console.log('form submitted', event, event.target)

  console.log('1. form submitted', form)

  console.log('2. deleting old errors')
  // errors.value = {} // Clear previous errors
  Object.keys(errors.value).forEach((key) => delete errors.value[key])
  console.log(errors.value)

  console.log('3. checking for new errors')

  validateField('amount')
  validateField('term')
  validateField('rate')
  validateField('type')

  console.log(Object.keys(errors.value))
  console.log(errors.value)

  if (Object.keys(errors.value).length !== 0) {
    // Validation failed, implement handling of failure as needed
    console.log('Form has validation errors. Please correct them.')
    console.log(errors.value)
    return
  }

  // if no errors are found
  // Validation passed, implement handling of form submission
  console.log('Form submitted successfully!', form)

  // Update the store state
  calculator.$patch({
    amount: parseFloat(form.amount.value.replace(/,/g, '')),
    term: parseFloat(form.term.value),
    rate: parseFloat(form.rate.value),
    type: form.type.value,
  })
}

function handleReset(event) {
  console.log('form reset', event, event.target)
  calculator.$reset()
  //event.target.reset()
}
</script>

<template>
  <form class="input-form" novalidate @submit.prevent="handleSubmit" @reset="handleReset">
    <div class="input-form__header">
      <h1 class="input-form__heading text-preset2">Mortgage Calculator</h1>
      <button type="reset" class="clear-all-button text-preset4">Clear All</button>
    </div>

    <div class="input-form__main">
      <div class="input-group-text">
        <label class="text-preset4" for="mortgage-amount">Mortgage Amount</label>
        <div class="input-with-affix">
          <input
            class="input-text text-preset3"
            type="text"
            id="mortgage-amount"
            inputmode="decimal"
            pattern="^\d+(?:,\d{1,3})*(?:\.\d+)?$"
            placeholder=" "
            required
            ref="input-amount"
            v-model="form.amount.value"
            @blur="validateField('amount')"
          />
          <span class="affix prefix text-preset3">&pound;</span>
        </div>
        <span class="input-error" v-if="errors.amount && !isAmountValid">{{ errors.amount }}</span>
      </div>

      <div class="input-group-multiple">
        <div class="input-group-text">
          <label class="text-preset4" for="mortgage-term">Mortgage Term</label>
          <div class="input-with-affix">
            <input
              class="input-text text-preset3"
              type="text"
              id="mortgage-term"
              inputmode="numeric"
              pattern="^\d+(?:,\d{1,3})*(?:\.\d+)?$"
              placeholder=" "
              required
              v-model="form.term.value"
              @blur="validateField('term')"
            />
            <span class="affix suffix text-preset3">years</span>
          </div>
          <span class="input-error" v-if="errors.term && !isTermValid">{{ errors.term }}</span>
        </div>

        <div class="input-group-text">
          <label class="text-preset4" for="interest-rate">Interest Rate</label>
          <div class="input-with-affix">
            <input
              class="input-text text-preset3"
              type="text"
              id="interest-rate"
              inputmode="decimal"
              pattern="^\d+(?:,\d{1,3})*(?:\.\d+)?$"
              placeholder=" "
              required
              v-model="form.rate.value"
              @blur="validateField('rate')"
            />
            <span class="affix suffix text-preset3">&percnt;</span>
          </div>
          <span class="input-error" v-if="errors.rate && !isRateValid">{{ errors.rate }}</span>
        </div>
      </div>

      <div class="fieldset-radio">
        <p class="text-preset4">Mortgage Type</p>
        <label class="input-radio__label text-preset3"
          ><input
            class="input-radio"
            type="radio"
            name="mortgage-type"
            id="mortgage-type-repayment"
            value="repayment"
            required
            v-model="form.type.value"
          />
          <span>Repayment</span></label
        >
        <label class="input-radio__label text-preset3"
          ><input
            class="input-radio"
            type="radio"
            name="mortgage-type"
            id="mortgage-type-interest-only"
            value="interest-only"
            v-model="form.type.value"
          />
          <span>Interest Only</span></label
        >
        <span class="input-error" v-if="errors.type && !isTypeValid">{{ errors.type }}</span>
      </div>
    </div>

    <div class="input-form__footer">
      <button class="calculate-button text-preset3" type="submit">
        <img
          class="calculate-button__icon"
          :src="getImageUrl('icon-calculator.svg')"
          width="24"
          height="24"
          alt=""
        />
        <span>Calculate Repayments</span>
      </button>
    </div>
  </form>
</template>

<style scoped>
/* Form */

.input-form {
  padding: var(--space-400) var(--space-300);
  display: grid;
  gap: var(--space-300);
}

/* Form Sections */

.input-form__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-100);
}

.input-form__main {
  width: 100%;
  display: grid;
  gap: var(--space-300);
}

/* Heading */

.input-form__heading {
  color: hsl(var(--color-heading-primary));
}

/* Clear (reset) Button */

.clear-all-button {
  cursor: pointer;
  border: 0;
  outline: 0;
  background: transparent;
  color: hsl(var(--color-text-primary));
  text-decoration: underline;
  text-underline-offset: 0.25em;
  padding: 0;
  margin: 0;
}

.clear-all-button:hover,
.clear-all-button:focus-visible {
  color: hsl(var(--color-text-hover));
}

.clear-all-button:focus-visible {
  outline: 2px dashed hsl(var(--color-text-hover));
  outline-offset: 6px;
}

/* Text Inputs */

.input-group-multiple {
  display: grid;
  align-items: start;
  row-gap: var(--space-150);
  column-gap: var(--space-300);
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
}

.input-group-text {
  display: grid;
  gap: var(--space-150);
}

.input-with-affix {
  --input-text-block-size: 48px;
  --input-text-border-radius: var(--br-100);
  --input-text-border-size: 1px;
  display: flex;
  border-radius: var(--input-text-border-radius);
  border: var(--input-text-border-size) solid hsl(var(--color-border));
  block-size: var(--input-text-block-size);
  overflow: hidden;
}

.input-text {
  flex-grow: 1;
  appearance: none;
  outline: none;
  border: none;
  padding-block: 0;
  padding-inline: var(--space-200);
  inline-size: 100%;
  color: hsl(var(--color-text-input));
}

.affix {
  display: block flex;
  align-items: center;
  background-color: hsl(var(--color-slate-100));
  color: hsl(var(--color-text-primary));
  padding-inline: var(--space-200);
}

.prefix {
  order: -1;
}

.input-group-text:hover .input-with-affix,
.input-group-text:has(:hover) .input-with-affix {
  border: var(--input-text-border-size) solid hsl(var(--color-slate-900));
}

.input-group-text:has(:focus-visible) .input-with-affix {
  border: var(--input-text-border-size) solid hsl(var(--color-accent));
  /* outline: 2px dashed hsl(var(--color-accent));
  outline-offset: 3px; */
}

.input-group-text:has(:focus-visible) .affix {
  background-color: hsl(var(--color-accent));
  color: hsl(var(--color-text-hover));
}

.input-group-text:has(input:not(:focus):not(:placeholder-shown):invalid) .input-with-affix {
  border: var(--input-text-border-size) solid hsl(var(--color-error-border));
}

.input-group-text:has(input:not(:focus):not(:placeholder-shown):invalid) .affix {
  background-color: hsl(var(--color-error-background));
  color: hsl(var(--color-error-text-secondary));
}

.input-error {
  color: hsl(var(--color-error-text-primary));
}

/* Radio Inputs */

.fieldset-radio {
  display: grid;
  gap: var(--space-150);
}

.input-radio__label {
  --input-radio-size: 19.5px;
  --input-text-block-size: 48px;
  --input-text-border-radius: var(--br-100);
  --input-text-border-size: 1px;

  position: relative;
  border-radius: var(--input-text-border-radius);
  border: var(--input-text-border-size) solid hsl(var(--color-border));
  block-size: var(--input-text-block-size);
  cursor: pointer;
  padding-inline: var(--space-200);
  display: flex;
  align-items: center;
  gap: var(--space-300);
}

.input-radio__label:hover,
.input-radio__label:has(:hover),
.input-radio__label:has(:focus-visible),
.input-radio__label:has(:checked) {
  border: var(--input-text-border-size) solid hsl(var(--color-accent));
}

.input-radio__label:has(:focus-visible) {
  outline: 2px dashed hsl(var(--color-accent));
  outline-offset: 3px;
}

.input-radio__label:has(:checked) {
  background: hsl(var(--color-accent-100));
}

.input-radio {
  cursor: pointer;
  position: absolute;
  block-size: var(--input-radio-size);
  inline-size: var(--input-radio-size);
  opacity: 0.00001;
  margin: 0;
}

.input-radio__label::before {
  content: '';
  display: block;
  block-size: var(--input-radio-size);
  inline-size: var(--input-radio-size);
  border-radius: var(--br-900);
  box-shadow: 0 0 0 1.75px hsl(var(--color-slate-700)) inset;
}

.input-radio__label:has(:checked)::before {
  box-shadow:
    0 0 0 1.75px hsl(var(--color-accent)) inset,
    0 0 0 4.25px white inset,
    0 0 0 12px hsl(var(--color-accent)) inset;
}

/* Calculate (submit) Button */

.calculate-button {
  --button-inline-size-max: 327px;
  cursor: pointer;
  background-color: hsl(var(--color-background-accent));
  color: hsl(var(--color-heading-primary));
  border: 0;
  outline: 0;
  block-size: 56px;
  inline-size: min(100%, var(--button-inline-size-max));
  border-radius: var(--br-900);
  display: block flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-150);
}

.calculate-button:hover,
.calculate-button:focus-visible {
  background-color: hsl(var(--color-accent-300));
}

.calculate-button:focus-visible {
  outline: 2px dashed hsl(var(--color-accent-300));
  outline-offset: 3px;
}

/* Media Queries */

@media (min-width: 44rem) {
  .input-form {
    padding: var(--space-500);
    gap: var(--space-500);
  }

  .calculate-button {
    --button-inline-size-max: 314px;
  }
}
</style>
