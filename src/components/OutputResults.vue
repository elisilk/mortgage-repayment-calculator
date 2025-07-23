<script setup>
import { useMortgageCalculatorStore } from '@/stores/mortgageCalculator'
import { storeToRefs } from 'pinia'

const calculator = useMortgageCalculatorStore()
const { isComplete, monthlyRepayment, totalRepayment } = storeToRefs(calculator)

function getImageUrl(url) {
  return new URL(`../assets/images/${url}`, import.meta.url).href
}
</script>

<template>
  <div class="output-results">
    <div v-if="!isComplete" class="output-results--empty">
      <img
        class="output-results__empty__illustration"
        :src="getImageUrl('illustration-empty.svg')"
        width="192"
        height="192"
        alt="illustration"
      />
      <h2 class="empty__heading text-preset2">Results shown here</h2>
      <p class="empty__desc text-preset4">
        Complete the form and click &ldquo;calculate repayments&rdquo; to see what your monthly
        repayments would be.
      </p>
    </div>
    <div v-else class="output-results--actual">
      <div class="results__header">
        <h2 class="results__heading text-preset2">Your results</h2>
        <p class="results__desc text-preset4">
          Your results are shown below based on the information you provided. To adjust the results,
          edit the form and click &ldquo;calculate repayments&rdquo; again.
        </p>
      </div>
      <div class="results__main">
        <div class="results__main-section">
          <h3 class="text-preset4">Your monthly repayments</h3>
          <output class="results__monthly-payments text-preset1">
            {{
              new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
              }).format(monthlyRepayment)
            }}
          </output>
        </div>
        <div class="results__main-section">
          <h3 class="text-preset4">Total you'll repay over the term</h3>
          <output class="results__total-payment text-preset2">
            {{
              new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
              }).format(totalRepayment)
            }}
          </output>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.output-results {
  background-color: hsl(var(--color-background-secondary));
  color: hsl(var(--color-text-secondary));

  padding: var(--space-400) var(--space-300);
}

.output-results--empty {
  block-size: 100%;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: var(--space-200);
}

.output-results--actual {
  display: grid;
  gap: var(--space-300); /* (m) 24px -> (t) 40px */
}

.results__header {
  display: grid;
  gap: var(--space-200);
}

.empty__heading {
  color: hsl(var(--color-heading-secondary));
}

.empty__desc {
  text-align: center;
  max-width: 55ch;
}

.results__heading {
  color: hsl(var(--color-white));
}

.results__main {
  background: hsl(var(--color-black) / 0.25);
  border-radius: var(--br-200);
  border-top: 4px solid hsl(var(--color-lime));
  padding: var(--space-300) var(--space-200);
}

.results__main-section {
  display: grid;
  gap: var(--space-100);
  padding-block: 0 var(--space-200); /* (m) 16px -> (t) 32px */
  border-bottom: 1px solid hsl(var(--color-slate-300) / 0.25);
}

.results__main-section:last-child {
  padding-block: var(--space-200) 0; /* (m) 16px -> (t) 32px */
  border: 0;
}

.results__monthly-payments {
  color: hsl(var(--color-lime));
}

.results__total-payment {
  color: hsl(var(--color-white));
}

@media (min-width: 44rem) {
  .output-results {
    padding: var(--space-500);
  }

  .output-results--actual {
    display: grid;
    gap: var(--space-500); /* (m) 24px -> (t) 40px */
  }

  .results__main {
    padding: var(--space-400);
  }

  .results__main-section {
    padding-block: 0 var(--space-400); /* (m) 16px -> (t) 32px */
  }

  .results__main-section:last-child {
    padding-block: var(--space-400) 0; /* (m) 16px -> (t) 32px */
  }
}

@media (min-width: 64rem) {
  .output-results {
    border-bottom-left-radius: var(--br-700);
  }
}
</style>
