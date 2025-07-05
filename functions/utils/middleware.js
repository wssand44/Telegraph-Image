import sentryPlugin from '@cloudflare/pages-plugin-sentry'
import '@sentry/tracing'

export async function errorHandling(context) {
  const env = context.env
  return context.next()
}

export function telemetryData(context) {
  const env = context.env
  if (
    typeof env.disable_telemetry == 'undefined' ||
    env.disable_telemetry == null ||
    env.disable_telemetry == ''
  )
    return context.next()
}

export async function traceData(context, span, op, name) {
  const data = context.data
  if (data.telemetry) {
    if (span) {
      console.log('span finish')
      span.finish()
    } else {
      console.log('span start')
      span = await context.data.transaction.startChild({ op: op, name: name })
    }
  }
}

async function fetchSampleRate(context) {
  const data = context.data
  if (data.telemetry) {
    const url = 'https://frozen-sentinel.pages.dev/signal/sampleRate.json'
    const response = await fetch(url)
    const json = await response.json()
    return json.rate
  }
}
